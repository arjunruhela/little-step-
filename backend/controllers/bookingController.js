const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Child = require('../models/Child');
const ChildcareCenter = require('../models/ChildcareCenter');
const PricingPlan = require('../models/PricingPlan');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');
const Provider = require('../models/Provider');

const toMinutes = (value) => {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [h,m] = value.split(':').map(Number);
  if (h > 23 || m > 59) return null;
  return h*60+m;
};

const dateOnly = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };

const createBooking = async (req, res, next) => {
  try {
    const { centerId, childId, planId, startDate, endDate, startTime, endTime, notes } = req.body;
    if (!centerId || !childId || !planId || !startDate) return res.status(400).json({success:false,message:'centerId, childId, planId and startDate are required'});
    if (![centerId,childId,planId].every(mongoose.isValidObjectId)) return res.status(400).json({success:false,message:'Invalid ID'});
    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return res.status(400).json({success:false,message:'Invalid booking dates'});
    const child = await Child.findOne({ _id: childId, parentId: req.user._id });
    if (!child) return res.status(404).json({success:false,message:'Child not found or does not belong to you'});
    const center = await ChildcareCenter.findById(centerId);
    if (!center) return res.status(404).json({success:false,message:'Center not found'});
    if (center.verificationStatus !== 'verified') return res.status(400).json({success:false,message:'This center is not currently verified'});
    const plan = await PricingPlan.findOne({ _id: planId, centerId, active:true });
    if (!plan) return res.status(404).json({success:false,message:'Active pricing plan not found'});

    if (plan.type === 'hourly') {
      if (!startTime || !endTime) return res.status(400).json({success:false,message:'Start and end time are required for hourly bookings'});
      const sm = toMinutes(startTime), em = toMinutes(endTime);
      if (sm === null || em === null || em <= sm) return res.status(400).json({success:false,message:'Invalid time range'});
    }

    // Check each requested day against center availability and overlapping active bookings.
    const days = [];
    for (let d = dateOnly(start); d <= dateOnly(end); d.setDate(d.getDate()+1)) days.push(new Date(d));
    let amount = Number(plan.price);
    if (plan.type === 'hourly') {
      const hours = Math.ceil((toMinutes(endTime)-toMinutes(startTime))/60);
      amount = hours * Number(plan.price) * days.length;
    } else if (plan.type === 'daily') {
      amount = Number(plan.price) * days.length;
    } else {
      amount = Number(plan.price);
    }

    const activeStatuses = ['pending','confirmed'];
    for (const day of days) {
      const dayStart = dateOnly(day);
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate()+1);
      const availability = await Availability.findOne({
        centerId,
        $or: [
          { date: { $gte: dayStart, $lt: dayEnd } },
          { dayOfWeek: day.toLocaleDateString('en-US',{weekday:'long'}) }
        ]
      }).sort({ date: -1 });

      if (availability && availability.availableCapacity <= 0) {
        return res.status(409).json({success:false,message:`No capacity available on ${dayStart.toISOString().slice(0,10)}`});
      }

      const overlapQuery = {
        centerId, status: {$in:activeStatuses},
        startDate: {$lte: dayEnd},
        endDate: {$gte: dayStart}
      };
      if (plan.type === 'hourly') overlapQuery.$or = [
        { startTime: {$lt:endTime}, endTime: {$gt:startTime} },
        { startDate: {$lt:dayEnd}, endDate: {$gt:dayStart} }
      ];
      const count = await Booking.countDocuments(overlapQuery);
      if (count >= center.capacity) return res.status(409).json({success:false,message:`Center capacity is full on ${dayStart.toISOString().slice(0,10)}`});
    }

    const provider = await Provider.findById(center.providerId).select('userId businessName');
    const booking = await Booking.create({
      parentId:req.user._id, centerId, providerId:center.providerId, childId, planId,
      planType:plan.type, startDate:start, endDate:end, startTime:startTime || '00:00',
      endTime:endTime || '23:59', amount, notes, status:'pending'
    });

    await Notification.create({
      userId:req.user._id, title:'Booking Request Submitted',
      message:`Your booking request for ${center.name} has been submitted.`,
      type:'booking', relatedId:booking._id
    });
    if (provider?.userId) await Notification.create({
      userId:provider.userId, title:'New Booking Request',
      message:`A new childcare booking request was submitted for ${center.name}.`,
      type:'booking', relatedId:booking._id
    });

    res.status(201).json({success:true,data:booking,message:'Booking created successfully'});
  } catch (error) { next(error); }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['confirmed','rejected','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({success:false,message:'Invalid booking status'});
    const booking = await Booking.findById(req.params.id).populate('centerId','name').populate('parentId','name email');
    if (!booking) return res.status(404).json({success:false,message:'Booking not found'});

    if (req.user.role === 'parent') {
      if (String(booking.parentId._id || booking.parentId) !== String(req.user._id) || status !== 'cancelled')
        return res.status(403).json({success:false,message:'Parents can only cancel their own bookings'});
    } else if (req.user.role === 'provider') {
      const provider = await Provider.findOne({userId:req.user._id}).select('_id');
      if (!provider || String(booking.providerId) !== String(provider._id)) return res.status(403).json({success:false,message:'Not authorized for this booking'});
      if (status === 'cancelled') return res.status(400).json({success:false,message:'Providers cannot cancel bookings through this endpoint'});
    }

    const transitions = {
      pending: ['confirmed','rejected','cancelled'],
      confirmed: ['completed','cancelled'],
      rejected: [],
      cancelled: [],
      completed: []
    };
    if (!transitions[booking.status].includes(status)) return res.status(400).json({success:false,message:`Cannot change booking from ${booking.status} to ${status}`});

    booking.status = status;
    await booking.save();

    const parentId = booking.parentId._id || booking.parentId;
    const labels = {
      confirmed:['Booking Confirmed','Your childcare booking has been confirmed.','success'],
      rejected:['Booking Rejected','Your childcare booking has been rejected.','warning'],
      completed:['Booking Completed','Your childcare booking has been marked completed.','success'],
      cancelled:['Booking Cancelled','Your childcare booking has been cancelled.','warning']
    };
    const [title,message,type] = labels[status];
    await Notification.create({userId:parentId,title,message,type,relatedId:booking._id});
    res.json({success:true,data:booking,message:`Booking ${status} successfully`});
  } catch (error) { next(error); }
};

const getMyBookings = async (req,res,next) => {
  try {
    const bookings = await Booking.find({parentId:req.user._id})
      .populate('centerId','name city images rating')
      .populate('childId','name dateOfBirth')
      .populate('planId','name type price')
      .sort({startDate:-1});
    res.json({success:true,data:bookings});
  } catch(error){ next(error); }
};

const getProviderBookings = async (req,res,next) => {
  try {
    const provider = await Provider.findOne({userId:req.user._id});
    if (!provider) return res.status(404).json({success:false,message:'Provider profile not found'});
    const filter={providerId:provider._id};
    if(req.query.status) filter.status=req.query.status;
    const bookings=await Booking.find(filter).populate('parentId','name email phone').populate('childId','name dateOfBirth').populate('centerId','name').populate('planId','name type price').sort({createdAt:-1});
    res.json({success:true,data:bookings});
  }catch(error){next(error);}
};

module.exports = {createBooking,updateBookingStatus,getMyBookings,getProviderBookings};
