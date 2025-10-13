import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

let gfs;
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/loler';
  const conn = await mongoose.connect(uri);
  gfs = Grid(conn.connection.db, mongoose.mongo);
  gfs.collection('tiles');
  console.log('Mongo connected');
};

export const getGFS = () => gfs;
