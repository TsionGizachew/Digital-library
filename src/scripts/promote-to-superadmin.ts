import mongoose from 'mongoose';
import { User } from '../entities/User';
import { UserRole } from '../types/enums';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to promote a specific user to SUPERADMIN
 * Usage: ts-node src/scripts/promote-to-superadmin.ts <email>
 */
async function promoteToSuperAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    // Get email from command line argument or use default
    const email = process.argv[2] || 'testadmin@library.com';

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');
    console.log('');

    // Find the user by email
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      console.log('');
      console.log('💡 Available users:');
      const allUsers = await User.find().select('email name role').limit(10);
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.name}) - Role: ${u.role}`);
      });
      await mongoose.disconnect();
      process.exit(1);
    }

    // Check if already SUPERADMIN
    if (user.role === UserRole.SUPERADMIN) {
      console.log('ℹ️  User is already a SUPERADMIN:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Promote to SUPERADMIN
    const previousRole = user.role;
    user.role = UserRole.SUPERADMIN;
    await user.save();

    console.log('✅ User promoted to SUPERADMIN successfully!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Previous Role: ${previousRole}`);
    console.log(`   New Role: ${user.role}`);
    console.log('');
    console.log('🎉 This user can now:');
    console.log('   ✅ Access Settings page');
    console.log('   ✅ Promote/demote admins');
    console.log('   ✅ View audit logs');
    console.log('   ✅ Manage all system configurations');

    await mongoose.disconnect();
    console.log('');
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error promoting user to SUPERADMIN:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
promoteToSuperAdmin();
