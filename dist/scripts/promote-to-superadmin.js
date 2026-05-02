"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../entities/User");
const enums_1 = require("../types/enums");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function promoteToSuperAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI not found in environment variables');
            process.exit(1);
        }
        const email = process.argv[2] || 'testadmin@library.com';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to database');
        console.log('');
        const user = await User_1.User.findOne({ email: email });
        if (!user) {
            console.error(`❌ User not found with email: ${email}`);
            console.log('');
            console.log('💡 Available users:');
            const allUsers = await User_1.User.find().select('email name role').limit(10);
            allUsers.forEach(u => {
                console.log(`   - ${u.email} (${u.name}) - Role: ${u.role}`);
            });
            await mongoose_1.default.disconnect();
            process.exit(1);
        }
        if (user.role === enums_1.UserRole.SUPERADMIN) {
            console.log('ℹ️  User is already a SUPERADMIN:');
            console.log(`   Email: ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            await mongoose_1.default.disconnect();
            process.exit(0);
        }
        const previousRole = user.role;
        user.role = enums_1.UserRole.SUPERADMIN;
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
        await mongoose_1.default.disconnect();
        console.log('');
        console.log('✅ Database connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error promoting user to SUPERADMIN:', error);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
}
promoteToSuperAdmin();
//# sourceMappingURL=promote-to-superadmin.js.map