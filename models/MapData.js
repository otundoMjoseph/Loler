import mongoose from 'mongoose';
const mapDataSchema = new mongoose.Schema({
  location:{ latitude:Number, longitude:Number },
  soil:Object,
  moisture:Object,
  flood_risk:String,
  gee_meta:Object,
  createdAt:{ type:Date, default: Date.now }
});
export default mongoose.model('MapData', mapDataSchema);
