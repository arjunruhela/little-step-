const router=require('express').Router();const c=require('../controllers/bookingController');const {authenticate,authorize}=require('../middleware/auth');
router.post('/',authenticate,authorize('parent'),c.createBooking);
router.get('/my',authenticate,authorize('parent'),c.getMyBookings);
router.patch('/:id/status',authenticate,authorize('parent','provider'),c.updateBookingStatus);
module.exports=router;
