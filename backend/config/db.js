const mongoose=require('mongoose');

const dns = require("dns");

// Use Google DNS and Cloudflare DNS
dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const connectDB=async()=>{
 if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is not configured');
 mongoose.set('strictQuery',true);
 const conn=await mongoose.connect(process.env.MONGODB_URI);
 console.log(`MongoDB Connected: ${conn.connection.host}`);
 return conn;
};
module.exports=connectDB;
