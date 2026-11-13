const mongoose = require('mongoose');
const ChildcareCenter = require('../models/ChildcareCenter');
const Caregiver = require('../models/Caregiver');
const PricingPlan = require('../models/PricingPlan');
const Review = require('../models/Review');
const Availability = require('../models/Availability');

const getCenters = async (req, res, next) => {
  try {
    const {
      city, ageGroup, is24x7, serviceType, minPrice, maxPrice,
      rating, minRating, verificationStatus = 'verified',
      sort = 'ratingDesc', page = 1, limit = 10
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const query = { verificationStatus };

    if (city) query.city = new RegExp(String(city).trim(), 'i');
    if (ageGroup) query.ageGroups = ageGroup;
    if (serviceType) query.serviceTypes = serviceType;
    if (is24x7 !== undefined) query.is24x7 = String(is24x7) === 'true';

    const minRatingValue = Number(minRating ?? rating);
    if (Number.isFinite(minRatingValue)) query.rating = { $gte: minRatingValue };

    // Price is stored in PricingPlan, so first identify centers with a matching plan.
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery = {};
      if (minPrice !== undefined && Number.isFinite(Number(minPrice))) priceQuery.$gte = Number(minPrice);
      if (maxPrice !== undefined && Number.isFinite(Number(maxPrice))) priceQuery.$lte = Number(maxPrice);
      const plans = await PricingPlan.find({ active: true, ...(Object.keys(priceQuery).length ? { price: priceQuery } : {}) }).select('centerId').lean();
      query._id = { $in: plans.map(p => p.centerId) };
    }

    let sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'ratingAsc') sortOption = { rating: 1, createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const [centers, total] = await Promise.all([
      ChildcareCenter.find(query).sort(sortOption).skip((pageNumber - 1) * limitNumber).limit(limitNumber).lean(),
      ChildcareCenter.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: centers,
      pagination: { page: pageNumber, limit: limitNumber, total, totalPages: Math.ceil(total / limitNumber) }
    });
  } catch (error) { next(error); }
};

const getCenterDetails = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success:false, message:'Invalid center ID' });
    const center = await ChildcareCenter.findById(req.params.id).populate('providerId', 'businessName verificationStatus').lean();
    if (!center) return res.status(404).json({ success:false, message:'Center not found' });

    const [caregivers, pricing, reviews, availability] = await Promise.all([
      Caregiver.find({ centerId: center._id }).sort({ createdAt: -1 }).lean(),
      PricingPlan.find({ centerId: center._id, active: true }).sort({ price: 1 }).lean(),
      Review.find({ centerId: center._id }).populate('parentId','name').sort({ createdAt: -1 }).lean(),
      Availability.find({ centerId: center._id }).sort({ date: 1, startTime: 1 }).limit(100).lean()
    ]);

    res.json({ success:true, data:{ center, caregivers, pricing, reviews, availability } });
  } catch (error) { next(error); }
};

module.exports = { getCenters, getCenterDetails };
