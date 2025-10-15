import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema({
  location:String, soil:Object, moisture:Object, flood_risk:String,
  summary:String, recommended_crops:[String], agroforestry_species:[String], immediate_actions:[String],
  createdAt:{type:Date, default:Date.now}
});
export default mongoose.model('Report', reportSchema);
