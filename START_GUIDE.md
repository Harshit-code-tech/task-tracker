# 🚀 ProductiveFire - Quick Start Guide

Get your task management system up and running in minutes!

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/atlas)
- **Modern Web Browser** - Chrome, Firefox, Edge, or Safari
- **Code Editor** - VS Code recommended

## ⚡ Quick Setup (5 minutes)

### Step 1: Download & Install
```bash
# Clone or download the project
cd task-tracker

# Install backend dependencies
cd backend
npm install
```

### Step 2: Database Setup
1. Create MongoDB Atlas account (free tier available)
2. Create a new cluster
3. Create database named: `productivefire`
4. Get your connection string

### Step 3: Configure Environment
```bash
# In backend folder, copy the example file
cp .env.example .env

# Edit .env file with your settings:
```

**Required Configuration:**
```env
# Server
PORT=3001
NODE_ENV=development

# Generate a secure JWT secret (recommended: 64 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Your MongoDB Atlas connection string
MONGODB_URI=(provided by mongodb)

# Email settings (optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 4: Start the Application
```bash
# Start backend server
cd backend
npm start

# The server will run on http://localhost:3001
# Open home.html in your browser to access the frontend
```

## 🎯 First Time Setup

### 1. Create Your Account
- Open `home.html` in your browser
- Click "Get Started" 
- Fill in your details
- Verify your email (if email is configured)

### 2. Start Using ProductiveFire
- **Add your first task** in the General Tasks section
- **Explore DSA problems** in the NeetCode tab
- **Check analytics** to see your progress
- **Meet your AI companion** - it will guide you!

## 🔧 Troubleshooting

### Common Issues

**Cannot connect to database:**
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database name is "productivefire"

**Server won't start:**
- Check if port 3001 is available
- Verify Node.js version (18+ required)
- Check for any missing environment variables

**Email not working:**
- Email features are optional
- Use App Passwords for Gmail (not regular password)
- Verify SMTP settings

### Quick Fixes

```bash
# Reset database (if needed)
cd backend
node cleanup.js

# Check server health
curl http://localhost:3001/api/health

# Restart with logs
npm start
```

## 📁 File Structure Overview

```
task-tracker/
├── home.html              # Landing page - START HERE
├── index.html             # Main application dashboard
├── login.html & signup.html # Authentication pages
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   └── .env               # Your configuration
├── script.js              # Frontend logic
├── styles.css             # Main styles
└── README.md              # Full documentation
```

## 🎉 You're Ready!

Once everything is running:

1. **Home Page** → Create account or sign in
2. **Dashboard** → Manage tasks and track progress  
3. **AI Companion** → Get productivity tips and motivation
4. **Analytics** → Monitor your achievements

## 🆘 Need Help?

- **Check README.md** for detailed documentation
- **Review .env.example** for configuration options
- **Check server logs** for error messages
- **Verify database connection** in MongoDB Atlas

## 🚀 Next Steps

- **Customize settings** in your profile
- **Set up email notifications** for better experience
- **Explore all features** - tasks, DSA practice, analytics
- **Meet your AI companion** for productivity tips!

---

**Happy Productivity! 🔥**

*The setup should take less than 5 minutes. If you encounter issues, check the troubleshooting section above.*
