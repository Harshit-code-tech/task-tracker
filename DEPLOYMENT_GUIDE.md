# 🚀 Vercel Deployment Guide - ProductiveFire

Quick guide to deploy your task tracker to Vercel in minutes!

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free tier available)
- [GitHub Account](https://github.com) 
- MongoDB Atlas cluster with connection string
- Email account for notifications (Gmail recommended)

## ⚡ Deploy to Vercel (3 steps)

### Step 1: Push to GitHub
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit - ProductiveFire ready for deployment"

# Push to GitHub
git remote add origin https://github.com/Harshit-code-tech/task-tracker
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `task-tracker` folder as root directory
5. Vercel will auto-detect the configuration

### Step 3: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
NODE_ENV=production
JWT_SECRET=your-secure-64-character-jwt-secret
MONGODB_URI=(provided by mongodb)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
BCRYPT_ROUNDS=14
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

## 🔧 Environment Variable Details

### 🔐 JWT_SECRET
Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 📧 Email Configuration
For Gmail:
1. Enable 2-Step Verification
2. Generate App Password: Google Account → Security → App passwords
3. Use the 16-character app password (not your regular password)

### 🗄️ MongoDB Atlas
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist all IPs (0.0.0.0/0) for Vercel
4. Get connection string from "Connect" → "Connect your application"

## 📁 Project Structure (Vercel-Ready)

```
task-tracker/
├── vercel.json              # ✅ Vercel configuration
├── package.json             # ✅ Dependencies (root level)
├── .env.production          # ✅ Production env template
├── home.html               # ✅ Landing page
├── index.html              # ✅ Main app
├── backend/
│   ├── server.js           # ✅ Serverless function
│   ├── package.json        # ✅ Backend dependencies
│   └── .env                # ✅ Local development
└── [other frontend files]
```

## 🚀 Deploy Commands

```bash
# Deploy to Vercel
npx vercel

# Or deploy directly
npx vercel --prod

# Check deployment status
npx vercel ls
```

## 🔍 Verify Deployment

After deployment, test these endpoints:

1. **Homepage**: `https://your-domain.vercel.app/`
2. **Health Check**: `https://your-domain.vercel.app/api/health`
3. **Sign Up**: Test account creation
4. **Sign In**: Test authentication
5. **Task Management**: Create/edit/delete tasks

## 🐛 Troubleshooting

### Common Issues:

**Build Fails:**
- Check package.json is in root directory
- Verify all environment variables are set
- Check Vercel function logs

**Database Connection:**
- Verify MongoDB URI format
- Check IP whitelist (allow all: 0.0.0.0/0)
- Test connection locally first

**Email Not Working:**
- Use App Password for Gmail (not regular password)
- Verify EMAIL_* environment variables
- Check Vercel function logs for email errors

**API Routes Not Working:**
- Verify vercel.json routing configuration
- Check function timeout limits
- Review Vercel function logs

### Debug Commands:
```bash
# Check Vercel logs
npx vercel logs

# Download and run locally
npx vercel dev

# Check environment variables
npx vercel env ls
```

## 📊 Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Email verification functions
- [ ] Task CRUD operations work
- [ ] Database persists data
- [ ] API endpoints respond correctly
- [ ] Mobile responsiveness works

## 🔄 Updates and Redeployment

```bash
# Make changes locally
git add .
git commit -m "Update: your changes"
git push

# Vercel auto-deploys on push to main branch
# Or manually redeploy:
npx vercel --prod
```

## 🌟 Performance Optimization

### For Production:
- MongoDB Atlas in same region as Vercel
- CDN for static assets (Vercel handles this)
- Database indexing for frequent queries
- Rate limiting configured (already included)

### Monitoring:
- Vercel Analytics (free tier included)
- MongoDB Atlas monitoring
- Error tracking via Vercel logs

## 🎉 Success!

Your ProductiveFire task tracker is now:
- ✅ **Live on the internet**
- ✅ **Fully functional**
- ✅ **Secure and scalable**
- ✅ **Ready for users**

**Your app URL**: `https://your-project-name.vercel.app`

---

## 🆘 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Check logs**: `npx vercel logs`

**Happy Deploying! 🚀**
