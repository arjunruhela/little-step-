const User=require('../models/User');
const Provider=require('../models/Provider');
const jwt=require('jsonwebtoken');
const generateToken=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
const publicUser=u=>({id:u._id,name:u.name,email:u.email,phone:u.phone,role:u.role,status:u.status,profileImage:u.profileImage||''});

exports.register=async(req,res,next)=>{try{
 const {name,email,phone,password,role='parent'}=req.body;
 if(!name||!email||!phone||!password)return res.status(400).json({success:false,message:'Name, email, phone and password are required'});
 if(!['parent','provider'].includes(role))return res.status(400).json({success:false,message:'Public registration is only available for parents and providers'});
 if(String(password).length<8)return res.status(400).json({success:false,message:'Password must be at least 8 characters'});
 const normalized=String(email).trim().toLowerCase();
 if(await User.findOne({email:normalized}))return res.status(409).json({success:false,message:'User already exists'});
 const user=await User.create({name,email:normalized,phone,password,role});
 if(role==='provider') await Provider.create({userId:user._id,businessName:`${name}'s Childcare`,contactEmail:normalized,contactPhone:phone});
 res.status(201).json({success:true,data:{token:generateToken(user._id),user:publicUser(user)},message:'User registered successfully'});
}catch(e){next(e);}};

exports.login=async(req,res,next)=>{try{
 const {email,password}=req.body; const user=await User.findOne({email:String(email||'').trim().toLowerCase()}).select('+password');
 if(!user||user.status!=='active'||!(await user.comparePassword(password||'')))return res.status(401).json({success:false,message:'Invalid email or password'});
 res.json({success:true,data:{token:generateToken(user._id),user:publicUser(user)},message:'Login successful'});
}catch(e){next(e);}};

exports.getMe=async(req,res,next)=>{try{const user=await User.findById(req.user._id).select('-password');res.json({success:true,data:user});}catch(e){next(e);}};
