const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serverless-compatible logging system
const logFile = path.join(__dirname, '..', 'app.log');

function writeLog(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}${data ? ' | Data: ' + JSON.stringify(data) : ''}`;
    
    // Always write to console (Vercel captures this)
    console.log(logEntry);
    
    // Only write to file if not in serverless environment
    if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
        try {
            fs.appendFileSync(logFile, logEntry + '\n');
        } catch (error) {
            // Silently fail if can't write to file (serverless environment)
            console.log('File logging disabled in serverless environment');
        }
    }
}

// Initialize logging (only in local development)
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    try {
        fs.writeFileSync(logFile, `=== Server Started at ${new Date().toISOString()} ===\n`);
    } catch (error) {
        // Silently fail if can't write to file
    }
}

writeLog('INFO', 'ProductiveFire Backend starting...');

// Trust proxy settings for deployment environments
if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    app.set('trust proxy', 1); // Trust first proxy for production/Vercel
} else {
    app.set('trust proxy', false); // Don't trust proxy in development
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'", 
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net"
            ],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://cdnjs.cloudflare.com", 
                "https://fonts.googleapis.com",
                "https://cdn.jsdelivr.net"
            ],
            fontSrc: [
                "'self'", 
                "https://fonts.gstatic.com", 
                "https://cdnjs.cloudflare.com",
                "data:"
            ],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: [
                "'self'", 
                "https://task-tracker-omega-orcin.vercel.app",
                "https://*.vercel.app"
            ],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true
}));
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://task-tracker-omega-orcin.vercel.app',
        'https://*.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the parent directory (frontend)
app.use(express.static(path.join(__dirname, '..')));

// Rate limiting with proper proxy handling
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased limit for development
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip rate limiting for development
    skip: (req) => {
        return process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1';
    },
    // Use a custom key generator that handles proxy scenarios
    keyGenerator: (req) => {
        // In production with trusted proxy, use forwarded IP
        if (app.get('trust proxy')) {
            return req.ip;
        }
        // In development, use connection remote address or fallback
        return req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip || 'localhost';
    }
});
app.use(limiter);

// Auth rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased from 5 to 20 requests per windowMs
    message: { error: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for development
    skip: (req) => {
        return process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1';
    },
    keyGenerator: (req) => {
        if (app.get('trust proxy')) {
            return req.ip;
        }
        return req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip || 'localhost';
    }
});

app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    writeLog('REQUEST', `${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query: req.query,
        body: req.method === 'POST' ? req.body : undefined
    });
    next();
});

// MongoDB Connection
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            writeLog('INFO', 'Connected to MongoDB', { database: mongoose.connection.db.databaseName });
        } else {
            writeLog('WARN', 'No MongoDB URI found, using in-memory storage');
        }
    } catch (error) {
        writeLog('ERROR', 'MongoDB connection error', { error: error.message });
        writeLog('WARN', 'Falling back to in-memory storage');
    }
};

// Connect to MongoDB
connectDB();

// Email configuration
const createEmailTransporter = () => {
    // Configure based on your email service
    // For Gmail: https://support.google.com/accounts/answer/185833
    // For other services: check their SMTP settings
    return nodemailer.createTransport({
        service: 'gmail', // Change to your email service
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });
};

const emailTransporter = createEmailTransporter();

// MongoDB Schemas
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    joinDate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    streak: { type: Number, default: 1 },
    emailVerified: { type: Boolean, default: false },
    settings: {
        soundEnabled: { type: Boolean, default: true },
        notificationsEnabled: { type: Boolean, default: true }
    }
});

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ['signup', 'forgot-password'], required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Add index for automatic cleanup of expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'general' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    dsaProblems: { type: Number, default: 0 },
    streak: { type: Number, default: 1 }
});

// Models
const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp', OtpSchema);
const Task = mongoose.model('Task', TaskSchema);
const Progress = mongoose.model('Progress', ProgressSchema);

// Helper function to check if MongoDB is available
const isMongoConnected = () => {
    return mongoose.connection.readyState === 1 && process.env.MONGODB_URI;
};

// Email utility functions
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'ProductiveFire <noreply@productivefire.com>',
            to: to,
            subject: subject,
            html: htmlContent
        };
        
        const result = await emailTransporter.sendMail(mailOptions);
        console.log('📧 Email sent successfully:', result.messageId);
        return true;
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return false;
    }
};

const createOtpEmailTemplate = (otp, type) => {
    const isSignup = type === 'signup';
    const title = isSignup ? 'Verify Your Email' : 'Reset Your Password';
    const message = isSignup ? 
        'Welcome to ProductiveFire! Please verify your email address with the code below:' :
        'You requested to reset your password. Use the code below to proceed:';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #ff6b6b, #4ecdc4); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 20px; text-align: center; }
            .otp-code { background-color: #f8f9fa; border: 2px dashed #6366f1; border-radius: 10px; padding: 20px; margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔥 ProductiveFire</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="otp-code">${otp}</div>
                <div class="warning">
                    <strong>⚠️ Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone.
                </div>
                <p>If you didn't request this ${isSignup ? 'verification' : 'password reset'}, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2025 ProductiveFire.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// In-memory storage (for development - use MongoDB/PostgreSQL in production)
let users = {};
let userTasks = {};
let userProgress = {};

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Validation middleware
const validateSignup = [
    body('name').trim().isLength({ min: 2 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
];

const validateSignin = [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle Chrome DevTools requests (suppress warnings)
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(404).end();
});

// Default route - redirect to home
app.get('/', (req, res) => {
    writeLog('INFO', 'Root access, redirecting to home', { ip: req.ip });
    res.redirect('/home.html');
});

// Auth check logging (for debugging)
app.post('/api/auth/log-check', (req, res) => {
    const { hasToken, hasUserData, page } = req.body;
    writeLog('AUTH_CHECK', `Frontend auth check on ${page}`, {
        hasToken,
        hasUserData,
        page,
        ip: req.ip
    });
    res.json({ logged: true });
});

// User Registration
app.post('/api/auth/signup', authLimiter, validateSignup, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        if (isMongoConnected()) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
        } else {
            if (users[email]) {
                return res.status(400).json({ error: 'User already exists' });
            }
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userData = {
            name,
            email,
            password: hashedPassword,
            avatar: null,
            joinDate: new Date(),
            lastLogin: new Date(),
            streak: 1,
            settings: {
                soundEnabled: true,
                notificationsEnabled: true
            }
        };

        let user;
        if (isMongoConnected()) {
            // Save to MongoDB
            user = new User(userData);
            await user.save();
            
            // Create initial progress
            const progress = new Progress({
                userId: user._id.toString(),
                totalTasks: 0,
                completedTasks: 0,
                dsaProblems: 0,
                streak: 1
            });
            await progress.save();
        } else {
            // Fallback to in-memory storage
            const userId = Date.now().toString();
            user = { id: userId, ...userData };
            users[email] = user;
            userTasks[userId] = [];
            userProgress[userId] = {
                totalTasks: 0,
                completedTasks: 0,
                dsaProblems: 0,
                streak: 1
            };
        }

        // Generate JWT token
        const userId = isMongoConnected() ? user._id.toString() : user.id;
        const token = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        userWithoutPassword.id = userId;
        delete userWithoutPassword._id;
        delete userWithoutPassword.__v;

        res.status(201).json({
            success: true,
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post('/api/auth/signin', authLimiter, validateSignin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        let user;
        if (isMongoConnected()) {
            user = await User.findOne({ email });
        } else {
            user = users[email];
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login and calculate streak
        const today = new Date().toDateString();
        const lastLogin = new Date(user.lastLogin).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogin === today) {
            // Same day, no change
        } else if (lastLogin === yesterday.toDateString()) {
            // Consecutive day
            user.streak++;
        } else {
            // Streak broken
            user.streak = 1;
        }

        user.lastLogin = new Date();

        // Save updated user
        if (isMongoConnected()) {
            await user.save();
        } else {
            users[email] = user;
        }

        // Generate JWT token
        const userId = isMongoConnected() ? user._id.toString() : user.id;
        const token = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        userWithoutPassword.id = userId;
        delete userWithoutPassword._id;
        delete userWithoutPassword.__v;

        res.json({
            success: true,
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
    try {
        const user = Object.values(users).find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, [
    body('name').optional().trim().isLength({ min: 2 }).escape(),
    body('avatar').optional().isString()
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = Object.values(users).find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, avatar, settings } = req.body;
        
        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;
        if (settings) user.settings = { ...user.settings, ...settings };

        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
    try {
        const tasks = userTasks[req.user.userId] || [];
        res.json({ tasks });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new task
app.post('/api/tasks', authenticateToken, [
    body('title').trim().isLength({ min: 1 }).escape(),
    body('category').optional().trim().escape(),
    body('priority').optional().isIn(['low', 'medium', 'high'])
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, category, priority } = req.body;
        
        const task = {
            id: Date.now().toString(),
            title,
            category: category || 'general',
            priority: priority || 'medium',
            completed: false,
            createdAt: new Date().toISOString(),
            userId: req.user.userId
        };

        if (!userTasks[req.user.userId]) {
            userTasks[req.user.userId] = [];
        }

        userTasks[req.user.userId].push(task);
        
        // Update progress
        if (!userProgress[req.user.userId]) {
            userProgress[req.user.userId] = { totalTasks: 0, completedTasks: 0, dsaProblems: 0, streak: 1 };
        }
        userProgress[req.user.userId].totalTasks++;

        res.status(201).json({ success: true, task });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update task
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const { completed, title, category, priority } = req.body;

        const tasks = userTasks[req.user.userId] || [];
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = tasks[taskIndex];
        
        if (completed !== undefined) task.completed = completed;
        if (title !== undefined) task.title = title;
        if (category !== undefined) task.category = category;
        if (priority !== undefined) task.priority = priority;

        task.updatedAt = new Date().toISOString();

        // Update progress
        if (completed && !task.completed) {
            userProgress[req.user.userId].completedTasks++;
        } else if (!completed && task.completed) {
            userProgress[req.user.userId].completedTasks--;
        }

        res.json({ success: true, task });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const tasks = userTasks[req.user.userId] || [];
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = tasks[taskIndex];
        tasks.splice(taskIndex, 1);

        // Update progress
        userProgress[req.user.userId].totalTasks--;
        if (task.completed) {
            userProgress[req.user.userId].completedTasks--;
        }

        res.json({ success: true, message: 'Task deleted' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user progress/analytics
app.get('/api/progress', authenticateToken, (req, res) => {
    try {
        const progress = userProgress[req.user.userId] || {
            totalTasks: 0,
            completedTasks: 0,
            dsaProblems: 0,
            streak: 1
        };
        
        const tasks = userTasks[req.user.userId] || [];
        const completedToday = tasks.filter(t => {
            const today = new Date().toDateString();
            const taskDate = new Date(t.updatedAt || t.createdAt).toDateString();
            return t.completed && taskDate === today;
        }).length;

        res.json({
            ...progress,
            completedToday,
            completionRate: progress.totalTasks > 0 ? (progress.completedTasks / progress.totalTasks * 100).toFixed(1) : 0
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send OTP for signup verification
app.post('/api/auth/send-signup-otp', authLimiter, [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Check if user already exists
        if (isMongoConnected()) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }
        } else {
            if (users[email]) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        writeLog('INFO', 'Generating OTP for signup', { 
            email, 
            otpLength: otp.length, 
            expiresAt: expiresAt.toISOString() 
        });

        // Save OTP
        if (isMongoConnected()) {
            // Remove any existing OTPs for this email
            await Otp.deleteMany({ email, type: 'signup' });
            
            const otpDoc = new Otp({
                email,
                otp,
                type: 'signup',
                expiresAt
            });
            await otpDoc.save();
            writeLog('INFO', 'OTP saved to database', { email, otpId: otpDoc._id });
        }

        // Send email
        const emailSent = await sendEmail(
            email,
            'Verify Your Email - ProductiveFire',
            createOtpEmailTemplate(otp, 'signup')
        );

        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send verification email' });
        }

        res.json({ 
            success: true, 
            message: 'Verification code sent to your email',
            email: email 
        });

    } catch (error) {
        console.error('Send signup OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify OTP and complete signup
app.post('/api/auth/verify-signup', authLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
    body('name').trim().isLength({ min: 2 }).escape(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp, name, password } = req.body;

        writeLog('INFO', 'OTP verification attempt', { 
            email, 
            otpProvided: otp,
            nameLength: name?.length,
            passwordLength: password?.length 
        });

        // Verify OTP
        let otpDoc;
        if (isMongoConnected()) {
            // First, clean up expired OTPs
            const now = new Date();
            const expiredCount = await Otp.deleteMany({ 
                email, 
                type: 'signup',
                expiresAt: { $lt: now }
            });
            
            if (expiredCount.deletedCount > 0) {
                writeLog('INFO', 'Cleaned up expired OTPs', { email, count: expiredCount.deletedCount });
            }
            
            // Find valid OTP with more flexible matching
            const otpQuery = { 
                email, 
                type: 'signup',
                expiresAt: { $gt: now }
            };
            
            // Try exact match first
            otpDoc = await Otp.findOne({ 
                ...otpQuery, 
                otp: otp.toString().trim()
            });
            
            // If no exact match, try case-insensitive comparison
            if (!otpDoc) {
                const allOtps = await Otp.find(otpQuery);
                otpDoc = allOtps.find(doc => 
                    doc.otp.toString().trim().toLowerCase() === otp.toString().trim().toLowerCase()
                );
            }
            
            if (!otpDoc) {
                // Enhanced debugging for OTP verification failures
                const anyOtp = await Otp.findOne({ email, type: 'signup' });
                const debugInfo = {
                    email,
                    provided: otp.toString().trim(),
                    providedLength: otp.toString().trim().length
                };
                
                if (anyOtp) {
                    debugInfo.stored = anyOtp.otp;
                    debugInfo.storedLength = anyOtp.otp.length;
                    debugInfo.expired = anyOtp.expiresAt < now;
                    debugInfo.timeDiff = Math.round((now - anyOtp.expiresAt) / 1000); // seconds
                    debugInfo.createdAt = anyOtp.createdAt;
                    debugInfo.expiresAt = anyOtp.expiresAt;
                    debugInfo.exactMatch = anyOtp.otp === otp.toString().trim();
                    debugInfo.caseInsensitiveMatch = anyOtp.otp.toLowerCase() === otp.toString().trim().toLowerCase();
                    
                    writeLog('WARN', 'OTP verification failed - details', debugInfo);
                } else {
                    writeLog('WARN', 'No OTP found for email', debugInfo);
                }
                
                return res.status(400).json({ error: 'Invalid or expired verification code' });
            }
            
            writeLog('INFO', 'OTP verification successful', { 
                email, 
                otpId: otpDoc._id,
                otpAge: Math.round((now - otpDoc.createdAt) / 1000) // seconds
            });
        } else {
            // For in-memory storage, we'll skip OTP verification in development
            writeLog('WARN', 'Skipping OTP verification in development mode', { email });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userData = {
            name,
            email,
            password: hashedPassword,
            avatar: null,
            joinDate: new Date(),
            lastLogin: new Date(),
            streak: 1,
            emailVerified: true,
            settings: {
                soundEnabled: true,
                notificationsEnabled: true
            }
        };

        let user;
        if (isMongoConnected()) {
            // Save to MongoDB
            user = new User(userData);
            await user.save();
            
            // Create initial progress
            const progress = new Progress({
                userId: user._id.toString(),
                totalTasks: 0,
                completedTasks: 0,
                dsaProblems: 0,
                streak: 1
            });
            await progress.save();
            
            // Delete used OTP
            await Otp.deleteOne({ _id: otpDoc._id });
        } else {
            // In-memory storage
            user = { id: Date.now().toString(), ...userData };
            users[email] = user;
            userTasks[user.id] = [];
            userProgress[user.id] = {
                totalTasks: 0,
                completedTasks: 0,
                dsaProblems: 0,
                streak: 1
            };
        }

        // Generate JWT token
        const userId = isMongoConnected() ? user._id.toString() : user.id;
        const token = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
        userWithoutPassword.id = userId;
        delete userWithoutPassword._id;
        delete userWithoutPassword.__v;

        res.json({
            success: true,
            message: 'Account created successfully!',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Verify signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot password - send reset code
app.post('/api/auth/forgot-password', authLimiter, [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Check if user exists
        let user;
        if (isMongoConnected()) {
            user = await User.findOne({ email });
        } else {
            user = users[email];
        }

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ 
                success: true, 
                message: 'If an account with this email exists, you will receive a reset code.' 
            });
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP
        if (isMongoConnected()) {
            // Remove any existing OTPs for this email
            await Otp.deleteMany({ email, type: 'forgot-password' });
            
            const otpDoc = new Otp({
                email,
                otp,
                type: 'forgot-password',
                expiresAt
            });
            await otpDoc.save();
        }

        // Send email
        const emailSent = await sendEmail(
            email,
            'Reset Your Password - ProductiveFire',
            createOtpEmailTemplate(otp, 'forgot-password')
        );

        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send reset email' });
        }

        res.json({ 
            success: true, 
            message: 'If an account with this email exists, you will receive a reset code.',
            email: email 
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify reset code
app.post('/api/auth/verify-reset-code', authLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        // Verify OTP
        let otpDoc;
        if (isMongoConnected()) {
            otpDoc = await Otp.findOne({ 
                email, 
                otp, 
                type: 'forgot-password',
                expiresAt: { $gt: new Date() }
            });
            
            if (!otpDoc) {
                return res.status(400).json({ error: 'Invalid or expired reset code' });
            }
        } else {
            // For in-memory storage, we'll skip OTP verification in development
            console.log('⚠️ Skipping OTP verification in development mode');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Store reset token (in production, you might want to store this in a separate collection)
        // For now, we'll use a short-lived JWT
        const resetJWT = jwt.sign(
            { email, resetToken, exp: Math.floor(Date.now() / 1000) + (15 * 60) }, // 15 minutes
            JWT_SECRET
        );

        res.json({ 
            success: true, 
            message: 'Reset code verified successfully',
            resetToken: resetJWT
        });

    } catch (error) {
        console.error('Verify reset code error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset password with verified token
app.post('/api/auth/reset-password', authLimiter, [
    body('resetToken').exists(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { resetToken, newPassword } = req.body;

        // Verify reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, JWT_SECRET);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const { email } = decoded;

        // Find user and update password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        if (isMongoConnected()) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            user.password = hashedPassword;
            await user.save();
            
            // Delete all OTPs for this email
            await Otp.deleteMany({ email });
        } else {
            const user = users[email];
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.password = hashedPassword;
        }

        res.json({ 
            success: true, 
            message: 'Password reset successfully! You can now sign in with your new password.' 
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Security routes
app.get('/security', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security - ProductiveFire</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <h1>Security Information</h1>
            <p>ProductiveFire is committed to security and protecting user data.</p>
            <p>If you discover any security vulnerabilities, please report them to security@productivefire.com</p>
            <p>We follow industry best practices including:</p>
            <ul>
                <li>HTTPS encryption</li>
                <li>Content Security Policy</li>
                <li>Rate limiting</li>
                <li>Input validation</li>
                <li>Password hashing</li>
            </ul>
        </body>
        </html>
    `);
});

app.get('/security-policy', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security Policy - ProductiveFire</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <h1>Security Policy</h1>
            <h2>Responsible Disclosure</h2>
            <p>We welcome security researchers to responsibly disclose security vulnerabilities.</p>
            <h2>Scope</h2>
            <p>This policy applies to all ProductiveFire services and applications.</p>
            <h2>Contact</h2>
            <p>Email: security@productivefire.com</p>
        </body>
        </html>
    `);
});

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    writeLog('ERROR', 'Server error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    writeLog('WARN', '404 Route not found', { url: req.url, method: req.method });
    res.status(404).json({ error: 'Route not found' });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        writeLog('INFO', `ProductiveFire Backend running on port ${PORT}`);
        writeLog('INFO', `Environment: ${process.env.NODE_ENV || 'development'}`);
        writeLog('INFO', `Health check: http://localhost:${PORT}/api/health`);
        writeLog('INFO', `Log file: ${logFile}`);
    });
}

module.exports = app;
