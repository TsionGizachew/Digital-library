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
async function createSuperAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI not found in environment variables');
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to database');
        const existingSuperAdmin = await User_1.User.findOne({ role: enums_1.UserRole.SUPERADMIN });
        if (existingSuperAdmin) {
            console.log('✅ SUPERADMIN already exists:');
            console.log(`   Email: ${existingSuperAdmin.email}`);
            console.log(`   Name: ${existingSuperAdmin.name}`);
            await mongoose_1.default.disconnect();
            process.exit(0);
        }
        const firstAdmin = await User_1.User.findOne({ role: enums_1.UserRole.ADMIN });
        if (firstAdmin) {
            firstAdmin.role = enums_1.UserRole.SUPERADMIN;
            await firstAdmin.save();
            console.log('✅ Converted first admin to SUPERADMIN:');
            console.log(`   Email: ${firstAdmin.email}`);
            console.log(`   Name: ${firstAdmin.name}`);
            console.log('');
            console.log('⚠️  IMPORTANT: This user now has SUPERADMIN privileges');
            console.log('⚠️  They can access Settings and manage all admins');
        }
        else {
            const superAdmin = await User_1.User.create({
                name: 'Super Administrator',
                email: 'superadmin@library.com',
                password: 'SuperAdmin@123',
                role: enums_1.UserRole.SUPERADMIN,
            });
            console.log('✅ Created new SUPERADMIN account:');
            console.log(`   Email: ${superAdmin.email}`);
            console.log(`   Name: ${superAdmin.name}`);
            console.log('');
            console.log('⚠️  DEFAULT PASSWORD: SuperAdmin@123');
            console.log('⚠️  PLEASE CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');
        }
        await mongoose_1.default.disconnect();
        console.log('');
        console.log('✅ Migration completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error creating SUPERADMIN:', error);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
}
createSuperAdmin();
//# sourceMappingURL=create-superadmin.js.map