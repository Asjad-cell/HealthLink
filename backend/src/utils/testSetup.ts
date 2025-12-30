import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Doctor } from '../models';

dotenv.config();

const testSetup = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ Please set MONGODB_URI in your .env file');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('✅ Admin user exists');
    } else {
      console.log('❌ No admin user found');
    }

    // Check collections
    const userCount = await User.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    
    console.log(`📊 Database Stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Doctors: ${doctorCount}`);

    console.log('\n🚀 Backend setup is ready!');
    console.log('📝 Next steps:');
    console.log('   1. Update MONGODB_URI in .env file');
    console.log('   2. Run: npm run dev');
    console.log('   3. Test API at: http://localhost:5000/api/v1/health');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Setup test failed:', error);
  }
};

testSetup();
