require('dotenv').config();
const express=require('express');
const cors=require('cors');
const path=require('path');
const connectDB=require('./config/db');
const errorHandler=require('./middleware/error');
const app=express();
app.use(cors({origin:process.env.CLIENT_URL?process.env.CLIENT_URL.split(',').map(x=>x.trim()):true,credentials:true}));
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.get('/api/health',(req,res)=>res.json({success:true,message:'Little Steps API is running'}));
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/centers',require('./routes/centerRoutes'));
app.use('/api/bookings',require('./routes/bookingRoutes'));
app.use('/api/parent',require('./routes/parentRoutes'));
app.use('/api/provider',require('./routes/providerRoutes'));
app.use('/api/admin',require('./routes/adminRoutes'));
app.use(errorHandler);

const PORT=process.env.PORT||5000;
const start=async()=>{await connectDB();app.listen(PORT,()=>console.log(`Server running in ${process.env.NODE_ENV||'development'} mode on port ${PORT}`));};
if(require.main===module)start().catch(e=>{console.error('Startup error:',e);process.exit(1);});
module.exports={app,start};
