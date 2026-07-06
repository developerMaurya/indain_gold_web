import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/billing_software';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 MongoDB connection has been established successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default mongoose;
