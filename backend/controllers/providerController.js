const Provider = require('../models/Provider');
const ChildcareCenter = require('../models/ChildcareCenter');
const Caregiver = require('../models/Caregiver');
const PricingPlan = require('../models/PricingPlan');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const Document = require('../models/Document');
const User = require('../models/User');

const getProvider = async (req,res,next)=>{
  try {
    const provider=await Provider.findOne({userId:req.user._id}).populate('userId','name email phone');
    if(!provider) return res.status(404).json({success:false,message:'Provider profile not found'});
    res.json({success:true,data:provider});
  }catch(e){next(e);}
};

const getProviderCenter=async(req,res,next)=>{try{
 const p=await Provider.findOne({userId:req.user._id}); if(!p)return res.status(404).json({success:false,message:'Provider profile not found'});
 const center=await ChildcareCenter.findOne({providerId:p._id}); if(!center)return res.status(404).json({success:false,message:'Center not found'});
 res.json({success:true,data:center});
}catch(e){next(e);}};

const upsertCenter=async(req,res,next)=>{
  try{
    const provider=await Provider.findOne({userId:req.user._id});
    if(!provider)return res.status(404).json({success:false,message:'Provider profile not found'});
    const allowed=['name','description','address','city','latitude','longitude','images','operatingHours','is24x7','ageGroups','serviceTypes','capacity','safetyMeasures','certifications'];
    const data={}; for(const k of allowed) if(req.body[k]!==undefined)data[k]=req.body[k];
    if(req.file)data.images=[...(data.images||[]),`/uploads/centers/${req.file.filename}`];
    const center=await ChildcareCenter.findOneAndUpdate({providerId:provider._id},{$set:{...data,providerId:provider._id}},{new:true,upsert:true,setDefaultsOnInsert:true});
    res.json({success:true,data:center,message:'Center saved successfully'});
  }catch(e){next(e);}
};
const uploadCenterImage=async(req,res,next)=>{
  try{
    if(!req.file)return res.status(400).json({success:false,message:'Image file is required'});
    const provider=await Provider.findOne({userId:req.user._id}); if(!provider)return res.status(404).json({success:false,message:'Provider profile not found'});
    const center=await ChildcareCenter.findOne({providerId:provider._id}); if(!center)return res.status(404).json({success:false,message:'Center not found'});
    center.images.push(`/uploads/centers/${req.file.filename}`); await center.save();
    res.status(201).json({success:true,data:{url:center.images.at(-1)}});
  }catch(e){next(e);}
};
const listCaregivers=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});if(!c)return res.json({success:true,data:[]});res.json({success:true,data:await Caregiver.find({centerId:c._id}).sort({createdAt:-1})});}catch(e){next(e);}};
const createCaregiver=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});if(!c)return res.status(404).json({success:false,message:'Center not found'});const data={...req.body,centerId:c._id};if(req.file)data.photo=`/uploads/caregivers/${req.file.filename}`;const item=await Caregiver.create(data);res.status(201).json({success:true,data:item});}catch(e){next(e);}};
const updateCaregiver=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});const item=await Caregiver.findOneAndUpdate({_id:req.params.id,centerId:c?._id},req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Caregiver not found'});res.json({success:true,data:item});}catch(e){next(e);}};
const deleteCaregiver=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});const item=await Caregiver.findOneAndDelete({_id:req.params.id,centerId:c?._id});if(!item)return res.status(404).json({success:false,message:'Caregiver not found'});res.json({success:true,data:null,message:'Caregiver deleted'});}catch(e){next(e);}};
const listPlans=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});res.json({success:true,data:c?await PricingPlan.find({centerId:c._id}).sort({price:1}):[]});}catch(e){next(e);}};
const createPlan=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});if(!c)return res.status(404).json({success:false,message:'Center not found'});const item=await PricingPlan.create({...req.body,centerId:c._id});res.status(201).json({success:true,data:item});}catch(e){next(e);}};
const updatePlan=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});const item=await PricingPlan.findOneAndUpdate({_id:req.params.id,centerId:c?._id},req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Plan not found'});res.json({success:true,data:item});}catch(e){next(e);}};
const deletePlan=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});const item=await PricingPlan.findOneAndUpdate({_id:req.params.id,centerId:c?._id},{active:false},{new:true});if(!item)return res.status(404).json({success:false,message:'Plan not found'});res.json({success:true,data:item});}catch(e){next(e);}};
const listAvailability=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});res.json({success:true,data:c?await Availability.find({centerId:c._id}).sort({date:1,startTime:1}):[]});}catch(e){next(e);}};
const createAvailability=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});if(!c)return res.status(404).json({success:false,message:'Center not found'});const item=await Availability.create({...req.body,centerId:c._id});res.status(201).json({success:true,data:item});}catch(e){next(e);}};
const updateAvailability=async(req,res,next)=>{try{const p=await Provider.findOne({userId:req.user._id});const c=await ChildcareCenter.findOne({providerId:p?._id});const item=await Availability.findOneAndUpdate({_id:req.params.id,centerId:c?._id},req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Availability not found'});res.json({success:true,data:item});}catch(e){next(e);}};
const getAnalytics=async(req,res,next)=>{
 try{const p=await Provider.findOne({userId:req.user._id});if(!p)return res.status(404).json({success:false,message:'Provider profile not found'});
 const match={providerId:p._id}; const completed={...match,status:'completed'};
 const [counts,revenue,monthly,statuses,center]=await Promise.all([
   Booking.aggregate([{$match:match},{$group:{_id:'$status',count:{$sum:1}}}]),
   Booking.aggregate([{$match:completed},{$group:{_id:null,revenue:{$sum:'$amount'}}}]),
   Booking.aggregate([{$match:completed},{$group:{_id:{$dateToString:{format:'%Y-%m',date:'$startDate'}},revenue:{$sum:'$amount'},bookings:{$sum:1}}},{$sort:{_id:1}}]),
   Booking.aggregate([{$match},{$group:{_id:'$status',count:{$sum:1}}}]),
   ChildcareCenter.findOne({providerId:p._id}).select('capacity')
 ]);
 const totalBookings=counts.reduce((s,x)=>s+x.count,0);
 const confirmed=counts.find(x=>x._id==='confirmed')?.count||0;
 const completedCount=counts.find(x=>x._id==='completed')?.count||0;
 res.json({success:true,data:{totalBookings,pendingBookings:counts.find(x=>x._id==='pending')?.count||0,confirmedBookings:confirmed,completedBookings:completedCount,totalRevenue:revenue[0]?.revenue||0,monthlyRevenue:monthly,bookingStatusDistribution:statuses,capacityUtilization:center&&center.capacity?Math.min(100,Math.round(((confirmed+completedCount)/Math.max(totalBookings,1))*100)):0}});
 }catch(e){next(e);}
};
const submitDocument=async(req,res,next)=>{try{if(!req.file)return res.status(400).json({success:false,message:'Document file is required'});const p=await Provider.findOne({userId:req.user._id});if(!p)return res.status(404).json({success:false,message:'Provider profile not found'});const doc=await Document.create({providerId:p._id,centerId:req.body.centerId||undefined,documentType:req.body.documentType||'verification',fileUrl:`/uploads/providers/${req.file.filename}`});res.status(201).json({success:true,data:doc});}catch(e){next(e);}};
module.exports={getProvider,getProviderCenter,upsertCenter,uploadCenterImage,listCaregivers,createCaregiver,updateCaregiver,deleteCaregiver,listPlans,createPlan,updatePlan,deletePlan,listAvailability,createAvailability,updateAvailability,getAnalytics,submitDocument};
