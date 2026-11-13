const router=require('express').Router();const {getCenters,getCenterDetails}=require('../controllers/centerController');
router.get('/',getCenters);router.get('/:id',getCenterDetails);module.exports=router;
