const multer=require('multer');
const path=require('path');
const fs=require('fs');
const base=path.join(__dirname,'..','uploads');
for(const dir of ['centers','providers','caregivers'])fs.mkdirSync(path.join(base,dir),{recursive:true});
const storage=multer.diskStorage({
 destination:(req,file,cb)=>{let dir='providers';if(file.fieldname==='centerImage')dir='centers';if(file.fieldname==='caregiverImage')dir='caregivers';cb(null,path.join(base,dir));},
 filename:(req,file,cb)=>{const ext=path.extname(file.originalname).toLowerCase();cb(null,`${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);}
});
const allowed=new Set(['image/jpeg','image/png','application/pdf']);
const fileFilter=(req,file,cb)=>allowed.has(file.mimetype)?cb(null,true):cb(new Error('Only JPG, PNG and PDF files are allowed'));
module.exports=multer({storage,fileFilter,limits:{fileSize:5*1024*1024}});
