import mongoose from 'mongoose';
import { User } from '../entities/User';
import { UserRole } from '../types/enums';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Migration script to create initial SUPERADMIN account
 * Run: npm run create-superadmin
 */
async function createSuperAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Check if SUPERADMIN already exists
    const existingSuperAdmin = await User.findOne({ role: UserRole.SUPERADMIN });
    
    if (existingSuperAdmin) {
      console.log('✅ SUPERADMIN already exists:');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Name: ${existingSuperAdmin.name}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Option 1: Convert first admin to SUPERADMIN
    const firstAdmin = await User.findOne({ role: UserRole.ADMIN });
    
    if (firstAdmin) {
      firstAdmin.role = UserRole.SUPERADMIN;
      await firstAdmin.save();
      console.log('✅ Converted first admin to SUPERADMIN:');
      console.log(`   Email: ${firstAdmin.email}`);
      console.log(`   Name: ${firstAdmin.name}`);
      console.log('');
      console.log('⚠️  IMPORTANT: This user now has SUPERADMIN privileges');
      console.log('⚠️  They can access Settings and manage all admins');
    } else {
      // Option 2: Create new SUPERADMIN account
      const superAdmin = await User.create({
        name: 'Super Administrator',
        email: 'superadmin@library.com',
        password: 'SuperAdmin@123', // Will be hashed by pre-save hook
        role: UserRole.SUPERADMIN,
      });
      console.log('✅ Created new SUPERADMIN account:');
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Name: ${superAdmin.name}`);
      console.log('');
      console.log('⚠️  DEFAULT PASSWORD: SuperAdmin@123');
      console.log('⚠️  PLEASE CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');
    }

    await mongoose.disconnect();
    console.log('');
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating SUPERADMIN:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the migration
createSuperAdmin();
