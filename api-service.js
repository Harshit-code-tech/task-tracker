// API Service for ProductiveFire
class APIService {
    constructor() {
        // Automatically detect the base URL based on environment
        this.baseURL = this.getBaseURL();
        this.token = localStorage.getItem('authToken');
    }

    // Detect base URL for different environments
    getBaseURL() {
        if (typeof window !== 'undefined') {
            // Browser environment
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Local development
                return 'http://localhost:3001/api';
            } else {
                // Production (Vercel or other hosting)
                return `${window.location.protocol}//${window.location.host}/api`;
            }
        }
        // Fallback for server-side or unknown environment
        return '/api';
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    // Get auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: this.getHeaders(),
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Authentication
    async signup(userData) {
        const response = await this.apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async signin(credentials) {
        const response = await this.apiCall('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    signout() {
        this.setToken(null);
        localStorage.removeItem('taskTrackerCurrentUser');
    }

    // User profile
    async getProfile() {
        return await this.apiCall('/user/profile');
    }

    async updateProfile(profileData) {
        return await this.apiCall('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Tasks
    async getTasks() {
        return await this.apiCall('/tasks');
    }

    async createTask(taskData) {
        return await this.apiCall('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    async updateTask(taskId, taskData) {
        return await this.apiCall(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }

    async deleteTask(taskId) {
        return await this.apiCall(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }

    // Progress/Analytics
    async getProgress() {
        return await this.apiCall('/progress');
    }

    // Health check
    async healthCheck() {
        try {
            return await this.apiCall('/health');
        } catch (error) {
            console.warn('Backend health check failed:', error);
            return { status: 'ERROR', error: error.message };
        }
    }
}

// Enhanced UserAuth class that uses backend
class BackendUserAuth {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('taskTrackerUsers')) || {};
        this.api = new APIService();
        this.checkBackendConnection();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkExistingLogin();
    }
    
    setupEventListeners() {
        // Auth buttons for landing page (check if they exist)
        const showSignInBtn = document.getElementById('showSignInBtn');
        const showSignUpBtn = document.getElementById('showSignUpBtn');
        
        if (showSignInBtn) {
            showSignInBtn.addEventListener('click', () => this.showSignInModal());
        }
        if (showSignUpBtn) {
            showSignUpBtn.addEventListener('click', () => this.showSignUpModal());
        }
        
        // Original auth buttons in header (for when logged in)
        const signInBtn = document.getElementById('signInBtn');
        const signUpBtn = document.getElementById('signUpBtn');
        
        if (signInBtn) signInBtn.addEventListener('click', () => this.showSignInModal());
        if (signUpBtn) signUpBtn.addEventListener('click', () => this.showSignUpModal());
        
        document.getElementById('userMenuBtn').addEventListener('click', () => this.showUserMenu());
        document.getElementById('signOutBtn').addEventListener('click', () => this.signOut());

        // Close buttons for modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.hideModals());
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModals();
                }
            });
        });

        // Form submissions
        document.getElementById('signInForm').addEventListener('submit', (e) => this.handleSignIn(e));
        document.getElementById('signUpForm').addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('profileForm').addEventListener('submit', (e) => this.handleProfileUpdate(e));
        
        // Modal switching
        document.getElementById('switchToSignUp').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModals();
            this.showSignUpModal();
        });
        document.getElementById('switchToSignIn').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModals();
            this.showSignInModal();
        });
        
        // Form submissions
        document.getElementById('signInForm').addEventListener('submit', (e) => this.handleSignIn(e));
        document.getElementById('signUpForm').addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('profileForm').addEventListener('submit', (e) => this.handleProfileUpdate(e));
        
        // Avatar upload
        document.getElementById('changeAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarUpload').click();
        });
        document.getElementById('avatarUpload').addEventListener('change', (e) => this.handleAvatarUpload(e));
        
        // Settings
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            if (robot) {
                robot.soundEnabled = e.target.checked;
            }
            this.saveUserSettings();
        });
        
        // Close modals
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => this.hideModals());
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModals();
            }
        });
    }

    async checkBackendConnection() {
        const health = await this.api.healthCheck();
        if (health.status === 'OK') {
            console.log('✅ Backend connected successfully');
            this.backendAvailable = true;
        } else {
            console.warn('⚠️ Backend not available, falling back to localStorage');
            this.backendAvailable = false;
        }
    }
    
    showSignInModal() {
        document.getElementById('signInModal').style.display = 'block';
    }
    
    showSignUpModal() {
        document.getElementById('signUpModal').style.display = 'block';
    }
    
    showUserMenu() {
        document.getElementById('userMenuModal').style.display = 'block';
        this.populateUserMenu();
    }
    
    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    showMainApp() {
        document.getElementById('authGuard').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        this.showUserProfile();
    }
    
    showAuthGuard() {
        document.getElementById('authGuard').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
    
    showUserProfile() {
        document.getElementById('userNotSignedIn').style.display = 'none';
        document.getElementById('userSignedIn').style.display = 'flex';
        
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userStreak').textContent = `🔥 ${this.currentUser.streak} day streak`;
        
        this.updateAvatarDisplay();
    }
    
    updateAvatarDisplay() {
        const avatar = document.getElementById('userAvatar');
        const initials = document.getElementById('userInitials');
        
        if (this.currentUser.avatar) {
            avatar.src = this.currentUser.avatar;
            avatar.style.display = 'block';
            initials.style.display = 'none';
        } else {
            const userInitials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            initials.textContent = userInitials;
            avatar.style.display = 'none';
            initials.style.display = 'flex';
        }
    }
    
    populateUserMenu() {
        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
        document.getElementById('soundToggle').checked = this.currentUser.settings?.soundEnabled ?? true;
        document.getElementById('notificationsToggle').checked = this.currentUser.settings?.notificationsEnabled ?? true;
        
        // Update large avatar
        const avatarLarge = document.getElementById('profileAvatarLarge');
        const initialsLarge = document.getElementById('profileInitialsLarge');
        
        if (this.currentUser.avatar) {
            avatarLarge.src = this.currentUser.avatar;
            avatarLarge.style.display = 'block';
            initialsLarge.style.display = 'none';
        } else {
            const userInitials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            initialsLarge.textContent = userInitials;
            avatarLarge.style.display = 'none';
            initialsLarge.style.display = 'flex';
        }
    }
    
    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarData = e.target.result;
                this.currentUser.avatar = avatarData;
                if (this.backendAvailable) {
                    this.api.updateProfile({ avatar: avatarData });
                } else {
                    localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                    this.users[this.currentUser.email] = this.currentUser;
                    localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
                }
                this.updateAvatarDisplay();
            };
            reader.readAsDataURL(file);
        }
    }
    
    saveUserSettings() {
        if (!this.currentUser) return;
        
        this.currentUser.settings = {
            soundEnabled: document.getElementById('soundToggle').checked,
            notificationsEnabled: document.getElementById('notificationsToggle').checked
        };
        
        if (this.backendAvailable) {
            this.api.updateProfile({ settings: this.currentUser.settings });
        } else {
            localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            this.users[this.currentUser.email] = this.currentUser;
            localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
        }
    }
    
    updateUserStats() {
        // This would integrate with your existing task tracking
        // For now, just ensure the stats are visible
    }

    async handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpPasswordConfirm').value;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        try {
            if (this.backendAvailable) {
                // Use backend
                const response = await this.api.signup({ name, email, password });
                this.currentUser = response.user;
                this.showMainApp();
                this.hideModals();
                
                setTimeout(() => {
                    if (robot) {
                        robot.say(`Welcome to ProductiveFire, ${name}! Let's build great habits together! 🚀`);
                        robot.celebrate();
                    }
                }, 1000);
            } else {
                // Fallback to localStorage
                await this.handleSignUpLocalStorage(e);
            }
        } catch (error) {
            this.showError(error.message || 'Sign up failed');
        }
    }

    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        try {
            if (this.backendAvailable) {
                // Use backend
                const response = await this.api.signin({ email, password });
                this.currentUser = response.user;
                this.showMainApp();
                this.hideModals();
                
                setTimeout(() => {
                    if (robot) {
                        robot.say(`Welcome back, ${response.user.name}! Ready to be productive? 🎉`);
                        robot.celebrate();
                    }
                }, 1000);
            } else {
                // Fallback to localStorage
                await this.handleSignInLocalStorage(e);
            }
        } catch (error) {
            this.showError(error.message || 'Sign in failed');
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;

        try {
            if (this.backendAvailable) {
                const response = await this.api.updateProfile({ 
                    name, 
                    email,
                    avatar: this.currentUser.avatar,
                    settings: this.currentUser.settings 
                });
                this.currentUser = response.user;
            } else {
                // Fallback to localStorage
                this.currentUser.name = name;
                this.currentUser.email = email;
                
                // Update in users database
                delete this.users[this.currentUser.email];
                this.users[email] = this.currentUser;
                
                localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
                localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            }

            this.showUserProfile();
            this.hideModals();

            if (robot) {
                robot.say('Profile updated! ✅');
                robot.react('happy');
            }
        } catch (error) {
            this.showError(error.message || 'Profile update failed');
        }
    }

    signOut() {
        if (this.backendAvailable) {
            this.api.signout();
        }
        
        localStorage.removeItem('taskTrackerCurrentUser');
        this.currentUser = null;
        
        this.hideModals();
        this.showAuthGuard();
        
        if (robot) {
            robot.say('Thanks for being productive! See you soon! 👋');
            robot.setMood('sad');
        }
    }

    // Fallback localStorage methods
    async handleSignUpLocalStorage(e) {
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        
        if (this.users[email]) {
            this.showError('User already exists');
            return;
        }
        
        const newUser = {
            name,
            email,
            password,
            avatar: null,
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            streak: 1,
            settings: {
                soundEnabled: true,
                notificationsEnabled: true
            }
        };
        
        this.users[email] = newUser;
        localStorage.setItem('taskTrackerUsers', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
        
        this.showMainApp();
        this.hideModals();
        
        setTimeout(() => {
            if (robot) {
                robot.say(`Welcome to ProductiveFire, ${name}! Let's build great habits together! 🚀`);
                robot.celebrate();
            }
        }, 1000);
    }
    
    async handleSignInLocalStorage(e) {
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;
        
        const user = this.users[email];
        if (user && user.password === password) {
            this.currentUser = user;
            this.currentUser.lastLogin = new Date().toISOString();
            this.updateStreak();
            localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            
            this.showMainApp();
            this.hideModals();
            
            setTimeout(() => {
                if (robot) {
                    robot.say(`Welcome back, ${user.name}! Ready to be productive? 🎉`);
                    robot.celebrate();
                }
            }, 1000);
        } else {
            this.showError('Invalid email or password');
        }
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastLogin = new Date(this.currentUser.lastLogin).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin === today) {
            return;
        } else if (lastLogin === yesterday.toDateString()) {
            this.currentUser.streak++;
        } else {
            this.currentUser.streak = 1;
        }
    }

    async checkExistingLogin() {
        const token = localStorage.getItem('authToken');
        
        if (token && this.backendAvailable) {
            try {
                this.api.setToken(token);
                const response = await this.api.getProfile();
                this.currentUser = response.user;
                this.showMainApp();
                this.updateUserStats();
                return;
            } catch (error) {
                console.warn('Token validation failed:', error);
                localStorage.removeItem('authToken');
            }
        }
        
        // Fallback to localStorage
        const savedUser = localStorage.getItem('taskTrackerCurrentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
            this.updateUserStats();
        } else {
            this.showAuthGuard();
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
            z-index: 10000;
            animation: slideInFromRight 0.3s ease-out;
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showMainApp() {
        document.getElementById('authGuard').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        this.updateUserStats();
        this.loadTasks();
    }

    showAuthGuard() {
        document.getElementById('authGuard').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    hideModals() {
        document.getElementById('signInModal').style.display = 'none';
        document.getElementById('signUpModal').style.display = 'none';
        document.getElementById('userModal').style.display = 'none';
    }

    showUserProfile() {
        if (this.currentUser) {
            document.getElementById('profileName').value = this.currentUser.name;
            document.getElementById('profileEmail').value = this.currentUser.email;
            document.getElementById('modalUserName').textContent = this.currentUser.name;
            document.getElementById('modalUserEmail').textContent = this.currentUser.email;
            document.getElementById('joinDate').textContent = new Date(this.currentUser.joinDate).toLocaleDateString();
            document.getElementById('userStreak').textContent = this.currentUser.streak || 1;
        }
    }

    updateUserStats() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const completedTasks = tasks.filter(task => task.completed).length;
            document.getElementById('tasksCompleted').textContent = completedTasks;
            document.getElementById('currentStreak').textContent = this.currentUser.streak || 1;
        }
    }

    async loadTasks() {
        try {
            if (this.backendAvailable) {
                const response = await this.api.getTasks();
                const tasks = response.tasks || [];
                
                // Sync with localStorage for offline functionality
                localStorage.setItem('tasks', JSON.stringify(tasks));
                
                // Dispatch event to update UI
                window.dispatchEvent(new CustomEvent('tasksLoaded', { detail: tasks }));
            } else {
                // Load from localStorage
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                window.dispatchEvent(new CustomEvent('tasksLoaded', { detail: tasks }));
            }
        } catch (error) {
            console.warn('Failed to load tasks from backend, using localStorage:', error);
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            window.dispatchEvent(new CustomEvent('tasksLoaded', { detail: tasks }));
        }
    }
}

// Add CSS for error notifications
const errorNotificationCSS = `
@keyframes slideInFromRight {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.error-notification {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}
`;

// Add CSS to head
const style = document.createElement('style');
style.textContent = errorNotificationCSS;
document.head.appendChild(style);
