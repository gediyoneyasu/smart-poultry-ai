const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_poultry_ai';

// Define schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  role: String,
  phone: String
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find the user
    const user = await User.findOne({ username: 'gediyon1' });
    
    if (user) {
      console.log('📝 Found user:', user.username);
      console.log('   Current role:', user.role);
      console.log('   Email:', user.email);
      
      // Hash new password
      const hashedPassword = await bcrypt.hash('123456', 10);
      user.password = hashedPassword;
      await user.save();
      
      console.log('✅ Password updated successfully!');
      
      // Verify
      const verify = await bcrypt.compare('123456', user.password);
      console.log('✅ Password test:', verify ? 'WORKING ✓' : 'FAILED ✗');
      
    } else {
      console.log('❌ User not found, creating new user...');
      
      const hashedPassword = await bcrypt.hash('123456', 10);
      const newUser = new User({
        name: 'Gediyon Eyasu',
        email: 'gediyon@example.com',
        username: 'gediyon1',
        password: hashedPassword,
        role: 'company_admin',
        phone: '1234567890'
      });
      
      await newUser.save();
      console.log('✅ New user created!');
    }
    
    await mongoose.disconnect();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

resetPassword();
