import dotenv from 'dotenv'; dotenv.config();
import connectDB from '../config/db.js'; await connectDB();
import User from '../models/User.js';
import Report from '../models/Report.js';
import MapData from '../models/MapData.js';
import bcrypt from 'bcryptjs';

const seed = async ()=>{
  await User.deleteMany(); await Report.deleteMany(); await MapData.deleteMany();
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const userPass = await bcrypt.hash('user123', salt);
  await User.create({ name:'Admin', email:'admin@loler.com', password:adminPass, role:'admin' });
  await User.create({ name:'Alice', email:'alice@loler.com', password:userPass });
  await User.create({ name:'Bob', email:'bob@loler.com', password:userPass });
  await Report.create({ location:'Nairobi', soil:{pH:6.8,fertility:'medium',nitrogen:42}, moisture:{value:0.42,status:'optimal'}, flood_risk:'low', summary:'Sample report 1', recommended_crops:['Maize'], agroforestry_species:['Grevillea'], immediate_actions:['Test action'] });
  await Report.create({ location:'Kericho', soil:{pH:5.9,fertility:'low',nitrogen:30}, moisture:{value:0.25,status:'low'}, flood_risk:'medium', summary:'Sample report 2', recommended_crops:['Tea'], agroforestry_species:['Calliandra'], immediate_actions:['Apply lime'] });
  console.log('Seeded DB: users and reports created.'); process.exit(0);
};
seed().catch(err=>{ console.error(err); process.exit(1); });
