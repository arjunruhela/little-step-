require('dotenv').config();
const mongoose=require('mongoose');
const User=require('../models/User');const Provider=require('../models/Provider');const Center=require('../models/ChildcareCenter');
const PricingPlan=require('../models/PricingPlan');const Availability=require('../models/Availability');const Child=require('../models/Child');
const Caregiver=require('../models/Caregiver');const Category=require('../models/Category');const Subscription=require('../models/Subscription');
const Booking=require('../models/Booking');const Review=require('../models/Review');const Notification=require('../models/Notification');const Dispute=require('../models/Dispute');

const seed=async()=>{
 try{
  if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is not configured');
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User.deleteMany({}),Provider.deleteMany({}),Center.deleteMany({}),PricingPlan.deleteMany({}),Availability.deleteMany({}),Child.deleteMany({}),Caregiver.deleteMany({}),Category.deleteMany({}),Subscription.deleteMany({}),Booking.deleteMany({}),Review.deleteMany({}),Notification.deleteMany({}),Dispute.deleteMany({})]);
  const [admin,p1,p2,p3]=await User.create([
   {name:'System Admin',email:'admin@littlesteps.com',phone:'9000000001',password:'password123',role:'admin'},
   {name:'Sarah Parent',email:'parent@littlesteps.com',phone:'9000000002',password:'password123',role:'parent'},
   {name:'Aarav Parent',email:'parent2@littlesteps.com',phone:'9000000003',password:'password123',role:'parent'},
   {name:'Priya Parent',email:'parent3@littlesteps.com',phone:'9000000004',password:'password123',role:'parent'}
  ]);
  const providerUsers=await User.create([
   {name:'Sunshine Provider',email:'provider@littlesteps.com',phone:'9000000011',password:'password123',role:'provider'},
   {name:'Happy Tots Provider',email:'provider2@littlesteps.com',phone:'9000000012',password:'password123',role:'provider'},
   {name:'Night Owls Provider',email:'provider3@littlesteps.com',phone:'9000000013',password:'password123',role:'provider'}
  ]);
  const providers=await Provider.create(providerUsers.map((u,i)=>({userId:u._id,businessName:['Sunshine Kids Academy','Happy Tots Daycare','Night Owls Childcare'][i],contactEmail:u.email,contactPhone:u.phone,verificationStatus:'verified',verifiedAt:new Date()})));
  const centers=await Center.create([
   {providerId:providers[0]._id,name:'Sunshine Kids Academy',description:'Trusted 24x7 childcare with flexible day and night care.',address:'123 Sunshine Avenue',city:'Ghaziabad',latitude:28.6692,longitude:77.4538,is24x7:true,ageGroups:['0-2','3-5'],serviceTypes:['daycare','babysitting','nightcare'],capacity:20,safetyMeasures:['Verified caregivers','Secure entry','First-aid trained staff'],certifications:['Safety Training Certificate'],verificationStatus:'verified',rating:4.8},
   {providerId:providers[1]._id,name:'Happy Tots Daycare',description:'Warm early-learning daycare for toddlers and preschoolers.',address:'45 Green Park',city:'Noida',latitude:28.5355,longitude:77.3910,is24x7:false,ageGroups:['2-5'],serviceTypes:['daycare','crèche'],capacity:25,safetyMeasures:['CCTV monitored premises','Child-safe play areas'],certifications:['Childcare Safety Certificate'],verificationStatus:'verified',rating:4.6},
   {providerId:providers[2]._id,name:'Night Owls Childcare',description:'Flexible overnight and emergency childcare for shift-working families.',address:'78 Central Road',city:'Delhi',latitude:28.6139,longitude:77.2090,is24x7:true,ageGroups:['0-2','3-5'],serviceTypes:['nightcare','emergency','babysitting'],capacity:15,safetyMeasures:['24x7 staffed reception','Verified caregivers'],certifications:['Emergency Care Training'],verificationStatus:'verified',rating:4.7}
  ]);
  const plans=[]; for(const c of centers){plans.push(...await PricingPlan.create([
    {centerId:c._id,type:'hourly',name:'Flexible Hourly',price:250,description:'Pay by the hour',includedServices:['Supervision','Meals'],active:true},
    {centerId:c._id,type:'daily',name:'Full Day Care',price:1200,description:'Full-day childcare',includedServices:['Supervision','Meals','Activities'],active:true},
    {centerId:c._id,type:'monthly',name:'Monthly Membership',price:18000,description:'Monthly childcare plan',includedServices:['Priority booking','Meals','Activities'],active:true}
  ]));}
  for(const c of centers){const arr=[];for(let i=0;i<30;i++){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+i);arr.push({centerId:c._id,date:d,dayOfWeek:d.toLocaleDateString('en-US',{weekday:'long'}),startTime:'00:00',endTime:'23:59',capacity:c.capacity,availableCapacity:c.capacity,type:c.is24x7?'24x7':'Day'});}await Availability.insertMany(arr);}
  await Caregiver.create(centers.flatMap((c,i)=>[1,2].map(n=>({centerId:c._id,name:`Caregiver ${i+1}-${n}`,qualification:'Certified Childcare Professional',experience:`${2+i} years`,specialization:n===1?'Early childhood care':'Infant care',bio:'Experienced and verified childcare professional.',verificationStatus:'verified'}))));
  await Category.insertMany([
   {name:'Infant',type:'ageGroup'},{name:'Toddler',type:'ageGroup'},{name:'Preschool',type:'ageGroup'},
   {name:'Daycare',type:'serviceType'},{name:'Crèche',type:'serviceType'},{name:'Babysitting',type:'serviceType'},{name:'Night Care',type:'serviceType'},{name:'Emergency Care',type:'serviceType'}
  ]);
  const children=await Child.create([
   {parentId:p1._id,name:'Leo',dateOfBirth:new Date('2022-05-15'),emergencyContact:{name:'Sarah Parent',phone:p1.phone,relationship:'Mother'}},
   {parentId:p2._id,name:'Mia',dateOfBirth:new Date('2021-10-12'),emergencyContact:{name:'Aarav Parent',phone:p2.phone,relationship:'Father'}},
   {parentId:p3._id,name:'Noah',dateOfBirth:new Date('2023-02-10'),emergencyContact:{name:'Priya Parent',phone:p3.phone,relationship:'Mother'}}
  ]);
  const plan=plans[0];const start=new Date();start.setDate(start.getDate()+1);const end=new Date(start);
  const booking=await Booking.create({parentId:p1._id,centerId:centers[0]._id,providerId:providers[0]._id,childId:children[0]._id,planId:plan._id,planType:'hourly',startDate:start,endDate:end,startTime:'10:00',endTime:'14:00',amount:1000,status:'completed'});
  await Review.create({parentId:p1._id,centerId:centers[0]._id,bookingId:booking._id,rating:5,comment:'Great childcare experience.'});
  await Center.findByIdAndUpdate(centers[0]._id,{rating:4.9,reviewCount:1});
  const subPlan=plans.find(x=>x.centerId.equals(centers[0]._id)&&x.type==='monthly');
  await Subscription.create({parentId:p1._id,centerId:centers[0]._id,planId:subPlan._id,startDate:new Date(),endDate:new Date(Date.now()+30*86400000),amount:subPlan.price,status:'active'});
  await Notification.create([{userId:p1._id,title:'Booking Completed',message:'Your demo booking has been completed.',type:'booking',relatedId:booking._id},{userId:providerUsers[0]._id,title:'Welcome',message:'Your provider dashboard is ready.',type:'system'}]);
  await Dispute.create({bookingId:booking._id,createdBy:p1._id,reason:'Demo dispute',description:'Sample dispute for admin dashboard.',status:'open'});
  console.log('Database seeded successfully.');
  console.log('Admin: admin@littlesteps.com / password123');
  console.log('Parent: parent@littlesteps.com / password123');
  console.log('Provider: provider@littlesteps.com / password123');
 }catch(e){console.error('Seeding error:',e);process.exitCode=1;}finally{await mongoose.disconnect();}
};
seed();
