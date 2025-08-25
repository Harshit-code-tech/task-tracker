// Fix verification issues - run this script to clean up problematic data
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}

// Define schemas (simplified versions)
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    emailVerified: { type: Boolean, default: false },
    joinDate: { type: Date, default: Date.now }
});

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp', OtpSchema);

async function fixVerificationIssues() {
    await connect();
    
    try {
        console.log('Starting verification cleanup...');
        
        // 1. Remove all expired OTPs
        const now = new Date();
        const expiredOtps = await Otp.deleteMany({ expiresAt: { $lt: now } });
        console.log(`Removed ${expiredOtps.deletedCount} expired OTPs`);
        
        // 2. Find unverified users with pending OTPs
        const unverifiedUsers = await User.find({ emailVerified: false });
        console.log(`Found ${unverifiedUsers.length} unverified users`);
        
        for (const user of unverifiedUsers) {
            const pendingOtps = await Otp.find({ email: user.email, type: 'signup' });
            console.log(`User ${user.email}: ${pendingOtps.length} pending OTPs`);
            
            // If user has been unverified for more than 24 hours, remove them
            const userAge = now - user.joinDate;
            const dayInMs = 24 * 60 * 60 * 1000;
            
            if (userAge > dayInMs) {
                await User.deleteOne({ _id: user._id });
                await Otp.deleteMany({ email: user.email, type: 'signup' });
                console.log(`Removed stale unverified user: ${user.email}`);
            }
        }
        
        // 3. Clean up orphaned OTPs (OTPs without corresponding user)
        const allSignupOtps = await Otp.find({ type: 'signup' });
        for (const otp of allSignupOtps) {
            const user = await User.findOne({ email: otp.email });
            if (!user) {
                await Otp.deleteOne({ _id: otp._id });
                console.log(`Removed orphaned OTP for: ${otp.email}`);
            }
        }
        
        // 4. Show current stats
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ emailVerified: true });
        const totalOtps = await Otp.countDocuments({ type: 'signup' });
        
        console.log('\n=== Current Stats ===');
        console.log(`Total users: ${totalUsers}`);
        console.log(`Verified users: ${verifiedUsers}`);
        console.log(`Unverified users: ${totalUsers - verifiedUsers}`);
        console.log(`Pending signup OTPs: ${totalOtps}`);
        
        console.log('\nCleanup completed successfully!');
        
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the cleanup
fixVerificationIssues();
