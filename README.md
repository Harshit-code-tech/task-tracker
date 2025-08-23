# 🔥 ProductiveFire - Ultimate Task Management System

A modern, secure task management platform with AI companion, featuring authentication, task tracking, DSA problems, and analytics dashboard.

![ProductiveFire](https://img.shields.io/badge/ProductiveFire-Task%20Management-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)

## 🌟 Features

### 🔐 Secure Authentication System
- **JWT-based authentication** with secure token management
- **Email verification** system
- **Password reset** functionality
- **User profiles** with customizable settings
- **Session management** with auto-logout

### 🤖 AI Robot Companion
- **Smart conversations** with contextual responses
- **Real-time expressions** based on user activity
- **Mood tracking** and adaptive encouragement
- **Achievement celebrations** with dynamic reactions
- **Time-aware interactions** (morning, afternoon, evening)

### 📝 Task Management
- **General task tracking** with categories and priorities
- **Due date management** with deadline alerts
- **Progress tracking** with completion statistics
- **Task filtering** and search functionality
- **Bulk operations** for efficient management

### 💻 DSA Problem Tracking
- **NeetCode 150** problem set integration
- **Progress visualization** with completion percentages
- **Difficulty-based organization** (Easy, Medium, Hard)
- **Learning path recommendations**
- **Coding practice tracking**

### 📊 Analytics Dashboard
- **Real-time statistics** and progress visualization
- **Daily streak tracking** for motivation
- **Completion rate analysis** with trends
- **Upcoming deadlines** overview
- **Performance insights** and recommendations

### 🎨 Modern UI/UX
- **Glassmorphism design** with blur effects
- **Responsive layout** for all devices
- **Smooth animations** and micro-interactions
- **Professional color scheme** with gradients
- **Accessibility features** for inclusive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshit-code-tech/task-tracker
   cd task-tracker
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Start backend server
   npm start
   
   # Open frontend
   # Navigate to http://localhost:3001 or open home.html
   ```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (generate a secure random string)
JWT_SECRET=your-secure-jwt-secret-key

# MongoDB Connection
MONGODB_URI=(url provided by mongodb)

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Security Settings
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Setup
1. Create a MongoDB Atlas cluster
2. Create a database named "productivefire"
3. Update the MONGODB_URI in your .env file
4. The application will automatically create required collections

## 📁 Project Structure

```
task-tracker/
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment template
│   └── cleanup.js          # Database maintenance
├── home.html              # Landing page
├── login.html             # Authentication pages
├── signup.html            
├── index.html             # Main application
├── auth-common.js         # Authentication utilities
├── script.js              # Frontend logic
├── styles.css             # Application styles
├── auth-styles.css        # Authentication styles
└── README.md              # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Tasks & Data
- `GET /api/tasks` - Retrieve user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/health` - Server health check

## 🛡️ Security Features

- **JWT token authentication** with expiration
- **Password hashing** using bcrypt
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS protection** for API endpoints
- **Environment variable protection**
- **Secure session management**

## 🔄 Development

### Running in Development Mode
```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend
# Open home.html in browser or serve with live server
```

### Testing
```bash
# Run tests
npm test

# Check server health
curl http://localhost:3001/api/health
```

## � Usage Guide

### Getting Started
1. **Create Account**: Visit the home page and click "Get Started"
2. **Verify Email**: Check your email for verification link
3. **Login**: Sign in with your credentials
4. **Dashboard**: Access the main task management interface

### Managing Tasks
- **Add Task**: Click "Add Task" and fill in details
- **Edit Task**: Click on any task to modify
- **Complete Task**: Check the completion box
- **Delete Task**: Use the delete button

### DSA Practice
- **NeetCode Tab**: Access the structured problem set
- **Track Progress**: Mark problems as completed
- **View Statistics**: Monitor your coding journey

### Analytics
- **Dashboard Overview**: View completion rates and streaks
- **Progress Charts**: Analyze your productivity trends
- **Goal Setting**: Set and track daily/weekly targets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## � License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the configuration guide

## 🔮 Future Enhancements

- [ ] Mobile application
- [ ] Team collaboration features
- [ ] Advanced AI insights
- [ ] Third-party integrations
- [ ] Offline synchronization
- [ ] Custom themes and layouts

---

**Made with ❤️ for productivity enthusiasts**
   - **Description**: Optional detailed description
   - **Priority**: High (red), Medium (yellow), Low (green)
   - **Deadline**: Optional due date and time
   - **Category**: Optional category for organization

### NeetCode Progress
1. Navigate to the "NeetCode 150" tab
2. Browse problems by category
3. Click on any problem card to mark it as complete/incomplete
4. Watch your progress bars fill up!

### Analytics Dashboard
- View your overall task completion rate
- Track your daily streak of completing tasks
- See upcoming deadlines for the next 7 days
- Monitor your NeetCode challenge progress
- Analyze completion rates by category

## 💾 Data Storage

All your data is stored locally in your browser using localStorage:
- Tasks and their completion status
- NeetCode progress tracking
- No data is sent to external servers
- Your progress persists between browser sessions

## 🎯 Perfect For

- **Coding Interview Preparation**: Track your LeetCode/NeetCode progress
- **Study Planning**: Organize study sessions with deadlines
- **Project Management**: Manage coding projects and tasks
- **Productivity Tracking**: Monitor daily coding habits
- **Goal Achievement**: Visual progress tracking for motivation

## 🛠️ Technical Features

- **Pure HTML/CSS/JavaScript**: No frameworks required
- **Local Storage**: All data stored in browser
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern CSS**: Glassmorphism, gradients, and animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## 📊 Sample Data

The application comes with sample tasks and NeetCode progress to help you understand the features. You can delete these and add your own data.

## 🎨 Customization

You can easily customize the appearance by modifying the CSS variables in `styles.css`:
- Change color schemes
- Adjust animations
- Modify layouts
- Add new themes

## 🔧 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- Requires ES6+ support

## 📈 Tips for Best Experience

1. **Set realistic deadlines** to stay motivated
2. **Use categories** to organize different types of work
3. **Check analytics regularly** to track progress
4. **Complete at least one task daily** to build streaks
5. **Break large tasks** into smaller, manageable pieces

## 🎉 Start Your Journey

Ready to boost your productivity and track your coding journey? Open the application and start organizing your tasks today!

---

*Built with ❤️ for developers who want to stay organized and motivated in their coding journey.*
