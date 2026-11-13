const errorHandler=(err,req,res,next)=>{
 console.error(err);
 if(err.name==='MulterError')return res.status(400).json({success:false,message:err.message});
 if(err.name==='CastError')return res.status(400).json({success:false,message:'Invalid resource ID'});
 if(err.code===11000)return res.status(409).json({success:false,message:'Duplicate field value entered'});
 if(err.name==='ValidationError')return res.status(400).json({success:false,message:Object.values(err.errors).map(x=>x.message).join(', ')});
 const status=err.statusCode||500;
 res.status(status).json({success:false,message:err.message||'Internal server error'});
};
module.exports=errorHandler;
