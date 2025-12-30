import { User } from '../models';

export const createDefaultAdmin = async (): Promise<void> => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const admin = new User({
        email: 'admin@healthlink.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin created successfully');
      console.log('📧 Email: admin@healthlink.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the default password after first login');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};
