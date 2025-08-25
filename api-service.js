// API Service for ProductiveFire
class APIService {
    constructor() {
        // Automatically detect the base URL based on environment
        this.baseURL = this.getBaseURL();
        // Load token from sessionStorage first, then localStorage for migration
        this.token = sessionStorage.getItem('authToken') || 
                    sessionStorage.getItem('productivefire_token') ||
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('productivefire_token');
        
        // If found in localStorage, migrate to sessionStorage
        if (!sessionStorage.getItem('authToken') && localStorage.getItem('authToken')) {
            sessionStorage.setItem('authToken', localStorage.getItem('authToken'));
            localStorage.removeItem('authToken');
        }
        if (!sessionStorage.getItem('productivefire_token') && localStorage.getItem('productivefire_token')) {
            sessionStorage.setItem('productivefire_token', localStorage.getItem('productivefire_token'));
            localStorage.removeItem('productivefire_token');
        }
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
            // Store in both formats for compatibility
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('productivefire_token', token);
        } else {
            // Clear both formats
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('productivefire_token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('productivefire_token');
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
        sessionStorage.removeItem('taskTrackerCurrentUser');
        // Clean up localStorage as well for migration
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
        // Prevent multiple instances
        if (window.backendUserAuthInstance) {
            console.warn('🔄 BackendUserAuth instance already exists, returning existing instance');
            return window.backendUserAuthInstance;
        }
        
        this.currentUser = null;
        // Remove localStorage usage for users storage - use backend only
        this.users = {}; // Will be loaded from backend when needed
        this.api = new APIService();
        this.backendAvailable = false;
        this.isInitialized = false;
        this.loadingTasks = false; // Prevent multiple task loads
        
        // Mark this as the active instance
        window.backendUserAuthInstance = this;
        
        console.log('🚀 BackendUserAuth initialized');
        this.init();
    }
    
    async init() {
        if (this.isInitialized) {
            console.warn('⚠️ BackendUserAuth already initialized');
            return;
        }
        
        this.isInitialized = true;
        console.log('🔧 BackendUserAuth: Starting initialization...');
        
        // Setup event listeners first (no async needed)
        this.setupEventListeners();
        
        // Then do async operations
        try {
            await this.checkBackendConnection();
            await this.checkExistingLogin();
        } catch (error) {
            console.error('❌ Auth initialization failed:', error);
            // Fall back to showing auth guard if something goes wrong
            this.handleNoAuthentication();
        }
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
        
        const userMenuBtn = document.getElementById('userMenuBtn');
        const signOutBtn = document.getElementById('signOutBtn');
        
        if (userMenuBtn) userMenuBtn.addEventListener('click', () => this.showUserMenu());
        if (signOutBtn) signOutBtn.addEventListener('click', () => this.signOut());

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
        const signInForm = document.getElementById('signInForm');
        const signUpForm = document.getElementById('signUpForm');
        const profileForm = document.getElementById('profileForm');
        
        if (signInForm) signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
        if (signUpForm) signUpForm.addEventListener('submit', (e) => this.handleSignUp(e));
        if (profileForm) profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        
        // Modal switching
        const switchToSignUp = document.getElementById('switchToSignUp');
        const switchToSignIn = document.getElementById('switchToSignIn');
        
        if (switchToSignUp) {
            switchToSignUp.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
                this.showSignUpModal();
            });
        }
        
        if (switchToSignIn) {
            switchToSignIn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
                this.showSignInModal();
            });
        }
        
        // Avatar upload
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const avatarUpload = document.getElementById('avatarUpload');
        if (changeAvatarBtn && avatarUpload) {
            changeAvatarBtn.addEventListener('click', () => {
                avatarUpload.click();
            });
            avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }
        
        // Settings
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                if (robot) {
                    robot.soundEnabled = e.target.checked;
                }
                this.saveUserSettings();
            });
        }
        
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
        // Only skip if we've already confirmed backend is available
        if (this.backendAvailable === true) {
            console.log('⚡ Backend connection already confirmed');
            return;
        }
        
        console.log('🔍 Checking backend connection...');
        try {
            // Add timeout to health check to improve responsiveness
            const healthCheckPromise = this.api.healthCheck();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Health check timeout')), 3000)
            );
            
            const health = await Promise.race([healthCheckPromise, timeoutPromise]);
            
            if (health && health.status === 'OK') {
                console.log('✅ Backend connected successfully');
                this.backendAvailable = true;
            } else {
                console.warn('⚠️ Backend health check returned non-OK status:', health);
                this.backendAvailable = false;
            }
        } catch (error) {
            console.warn('⚠️ Backend not available, falling back to localStorage:', error.message);
            this.backendAvailable = false;
        }
    }
    
    showSignInModal() {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    showSignUpModal() {
        const modal = document.getElementById('signUpModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    showUserMenu() {
        const modal = document.getElementById('userMenuModal');
        if (modal) {
            modal.style.display = 'block';
            this.populateUserMenu();
        }
    }
    
    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    showMainApp() {
        const authGuard = document.getElementById('authGuard');
        const mainApp = document.getElementById('mainApp');
        if (authGuard) authGuard.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        this.showUserProfile();
    }
    
    showAuthGuard() {
        const authGuard = document.getElementById('authGuard');
        const mainApp = document.getElementById('mainApp');
        if (authGuard) authGuard.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }
    
    showUserProfile() {
        if (!this.currentUser) {
            console.warn('No current user data available');
            return;
        }
        
        const userNotSignedIn = document.getElementById('userNotSignedIn');
        const userSignedIn = document.getElementById('userSignedIn');
        
        if (userNotSignedIn) userNotSignedIn.style.display = 'none';
        if (userSignedIn) userSignedIn.style.display = 'flex';
        
        // Safely update user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl && this.currentUser.name) {
            userNameEl.textContent = this.currentUser.name;
        }
        
        // Safely update user streak
        const userStreakEl = document.getElementById('userStreak');
        if (userStreakEl) {
            const streak = this.currentUser.streak || 0;
            userStreakEl.textContent = `🔥 ${streak} day streak`;
        }
        
        this.updateAvatarDisplay();
    }
    
    updateAvatarDisplay() {
        if (!this.currentUser || !this.currentUser.name) {
            console.warn('No current user data for avatar display');
            return;
        }
        
        const avatar = document.getElementById('userAvatar');
        const initials = document.getElementById('userInitials');
        
        if (!avatar || !initials) {
            console.warn('Avatar elements not found in DOM');
            return;
        }
        
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
        if (!this.currentUser) {
            console.warn('No current user data for menu population');
            return;
        }
        
        // Safely populate profile fields
        const profileNameEl = document.getElementById('profileName');
        const profileEmailEl = document.getElementById('profileEmail');
        const soundToggleEl = document.getElementById('soundToggle');
        const notificationsToggleEl = document.getElementById('notificationsToggle');
        
        if (profileNameEl && this.currentUser.name) {
            profileNameEl.value = this.currentUser.name;
        }
        if (profileEmailEl && this.currentUser.email) {
            profileEmailEl.value = this.currentUser.email;
        }
        if (soundToggleEl) {
            soundToggleEl.checked = this.currentUser.settings?.soundEnabled ?? true;
        }
        if (notificationsToggleEl) {
            notificationsToggleEl.checked = this.currentUser.settings?.notificationsEnabled ?? true;
        }
        
        // Update large avatar
        const avatarLarge = document.getElementById('profileAvatarLarge');
        const initialsLarge = document.getElementById('profileInitialsLarge');
        
        if (avatarLarge && initialsLarge && this.currentUser.name) {
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
                    // Store in both formats for compatibility
                    sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                    sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
                    this.users[this.currentUser.email] = this.currentUser;
                }
                this.updateAvatarDisplay();
            };
            reader.readAsDataURL(file);
        }
    }
    
    saveUserSettings() {
        if (!this.currentUser) return;
        
        const soundToggle = document.getElementById('soundToggle');
        const notificationsToggle = document.getElementById('notificationsToggle');
        
        this.currentUser.settings = {
            soundEnabled: soundToggle ? soundToggle.checked : true,
            notificationsEnabled: notificationsToggle ? notificationsToggle.checked : true
        };
        
        if (this.backendAvailable) {
            this.api.updateProfile({ settings: this.currentUser.settings });
        } else {
            // Store in both formats for compatibility
            sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
            this.users[this.currentUser.email] = this.currentUser;
            // Note: Remove localStorage usage for users storage
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
                
                // Store user data in both formats for compatibility
                sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
                
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
                
                // Ensure token is properly stored (api.signin should have done this, but let's be sure)
                if (response.token) {
                    sessionStorage.setItem('authToken', response.token);
                    sessionStorage.setItem('productivefire_token', response.token);
                    console.log('✅ Token stored successfully:', response.token.substring(0, 20) + '...');
                }
                
                // Store user data in both formats for compatibility
                sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
                
                console.log('✅ User data stored, redirecting to main app...');
                
                // Mark auth as complete to prevent conflicts
                sessionStorage.setItem('auth_check_done', 'true');
                sessionStorage.setItem('backend_signin_complete', 'true');
                
                // Hide modals first
                this.hideModals();
                
                // Redirect to main app instead of trying to show it on auth page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 100);
                
                // Delayed robot greeting for when app loads
                setTimeout(() => {
                    if (robot) {
                        robot.say(`Welcome back, ${response.user.name}! Ready to be productive? 🎉`);
                        robot.celebrate();
                    }
                }, 2000);
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
                
                // Store in both formats for compatibility
                sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
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
        console.log('🚪 BackendUserAuth signOut called...');
        
        if (this.backendAvailable) {
            this.api.signout();
        }
        
        // Clear all user data from both storage formats
        sessionStorage.removeItem('taskTrackerCurrentUser');
        sessionStorage.removeItem('productivefire_user');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('productivefire_token');
        
        // Clear auth flags
        sessionStorage.removeItem('auth_check_done');
        sessionStorage.removeItem('backend_signin_complete');
        sessionStorage.removeItem('auth_redirect_attempted');
        sessionStorage.removeItem('redirect_in_progress');
        
        // Clean up localStorage as well for migration
        localStorage.removeItem('taskTrackerCurrentUser');
        localStorage.removeItem('productivefire_user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('productivefire_token');
        
        this.currentUser = null;
        
        console.log('✅ All user data cleared by BackendUserAuth, redirecting to home...');
        
        this.hideModals();
        
        if (robot) {
            robot.say('Thanks for being productive! See you soon! 👋');
            robot.setMood('sad');
        }
        
        // Ensure clean redirect without loops
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 100);
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
        // Note: Remove localStorage usage for users storage
        
        this.currentUser = newUser;
        // Store in both formats for compatibility
        sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
        sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
        
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
            // Store in both formats for compatibility
            sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
            sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
            
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
        console.log('🔍 BackendUserAuth: Checking existing login...');
        
        // Check if this is right after a successful backend signin
        if (sessionStorage.getItem('backend_signin_complete')) {
            console.log('🚀 Backend signin just completed, skipping auth check');
            sessionStorage.removeItem('backend_signin_complete');
            return true;
        }
        
        // Check sessionStorage first (more secure)
        const token = sessionStorage.getItem('authToken') || 
                     sessionStorage.getItem('productivefire_token') ||
                     localStorage.getItem('authToken') ||
                     localStorage.getItem('productivefire_token');
        
        if (token && this.backendAvailable) {
            try {
                this.api.setToken(token);
                const response = await this.api.getProfile();
                this.currentUser = response.user;
                
                // Store user data in both formats for compatibility
                sessionStorage.setItem('taskTrackerCurrentUser', JSON.stringify(this.currentUser));
                sessionStorage.setItem('productivefire_user', JSON.stringify(this.currentUser));
                
                // Migrate token to sessionStorage if it was in localStorage
                if (localStorage.getItem('authToken') && !sessionStorage.getItem('authToken')) {
                    sessionStorage.setItem('authToken', token);
                    localStorage.removeItem('authToken');
                }
                if (localStorage.getItem('productivefire_token') && !sessionStorage.getItem('productivefire_token')) {
                    sessionStorage.setItem('productivefire_token', token);
                    localStorage.removeItem('productivefire_token');
                }
                
                this.showMainApp();
                this.updateUserStats();
                console.log('✅ User authenticated via backend token');
                return true; // Important: return true to indicate successful authentication
            } catch (error) {
                console.warn('Token validation failed:', error);
                // Clear invalid tokens but keep user data for fallback
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('productivefire_token');
                localStorage.removeItem('authToken');
                localStorage.removeItem('productivefire_token');
                // Don't return here - fall through to check local user data
            }
        }
        
        // Check if we have user data stored locally (multiple formats)
        const savedUser = sessionStorage.getItem('taskTrackerCurrentUser') || 
                         sessionStorage.getItem('productivefire_user') ||
                         localStorage.getItem('taskTrackerCurrentUser') ||
                         localStorage.getItem('productivefire_user');
                         
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                
                // Migrate user data to sessionStorage if it was in localStorage
                if (localStorage.getItem('taskTrackerCurrentUser') && !sessionStorage.getItem('taskTrackerCurrentUser')) {
                    sessionStorage.setItem('taskTrackerCurrentUser', savedUser);
                    localStorage.removeItem('taskTrackerCurrentUser');
                }
                if (localStorage.getItem('productivefire_user') && !sessionStorage.getItem('productivefire_user')) {
                    sessionStorage.setItem('productivefire_user', savedUser);
                    localStorage.removeItem('productivefire_user');
                }
                
                this.showMainApp();
                this.updateUserStats();
                console.log('✅ User loaded from storage:', this.currentUser.name);
                return true; // Important: return true to indicate successful authentication
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.handleNoAuthentication();
            }
        } else {
            console.warn('⚠️ No authentication data found');
            this.handleNoAuthentication();
        }
    }
    
    handleNoAuthentication() {
        // Check if auth is already in progress or complete
        if (sessionStorage.getItem('backend_signin_complete') || 
            sessionStorage.getItem('auth_check_done') || 
            this.currentUser) {
            console.log('🚫 Auth already in progress or complete, skipping handleNoAuthentication');
            return;
        }
        
        // Prevent multiple redirects
        if (sessionStorage.getItem('auth_redirect_attempted')) {
            console.log('🚫 Auth redirect already attempted, skipping');
            return;
        }
        
        // Check if we're on the main app page (index.html) vs auth page (home.html)
        const hasAuthGuard = document.getElementById('authGuard');
        const mainApp = document.getElementById('mainApp');
        
        if (hasAuthGuard) {
            // We're on home.html - show auth guard
            this.showAuthGuard();
        } else if (mainApp) {
            // We're on index.html - redirect to home since user isn't authenticated
            console.log('🔄 No auth on main app page, redirecting to home...');
            sessionStorage.setItem('auth_redirect_attempted', 'true');
            
            if (!sessionStorage.getItem('redirect_in_progress')) {
                sessionStorage.setItem('redirect_in_progress', 'true');
                setTimeout(() => {
                    sessionStorage.removeItem('redirect_in_progress');
                    sessionStorage.removeItem('auth_redirect_attempted');
                    window.location.href = 'home.html';
                }, 500);
            }
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
        const authGuard = document.getElementById('authGuard');
        const mainApp = document.getElementById('mainApp');
        if (authGuard) authGuard.style.display = 'none';
        if (mainApp) mainApp.style.display = 'flex';
        this.updateUserStats();
        this.loadTasks();
    }

    showAuthGuard() {
        const authGuard = document.getElementById('authGuard');
        const mainApp = document.getElementById('mainApp');
        if (authGuard) authGuard.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }

    hideModals() {
        // Safely hide all possible modals
        const modalIds = ['signInModal', 'signUpModal', 'userModal', 'userMenuModal'];
        modalIds.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'none';
            }
        });
        
        // Also hide any modal with the modal class
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    showUserProfile() {
        if (!this.currentUser) {
            console.warn('No current user data available');
            return;
        }
        
        // Safely populate profile fields only if they exist
        const profileNameEl = document.getElementById('profileName');
        if (profileNameEl && this.currentUser.name) {
            profileNameEl.value = this.currentUser.name;
        }
        
        const profileEmailEl = document.getElementById('profileEmail');
        if (profileEmailEl && this.currentUser.email) {
            profileEmailEl.value = this.currentUser.email;
        }
        
        const modalUserNameEl = document.getElementById('modalUserName');
        if (modalUserNameEl && this.currentUser.name) {
            modalUserNameEl.textContent = this.currentUser.name;
        }
        
        const modalUserEmailEl = document.getElementById('modalUserEmail');
        if (modalUserEmailEl && this.currentUser.email) {
            modalUserEmailEl.textContent = this.currentUser.email;
        }
        
        const joinDateEl = document.getElementById('joinDate');
        if (joinDateEl && this.currentUser.joinDate) {
            joinDateEl.textContent = new Date(this.currentUser.joinDate).toLocaleDateString();
        }
        
        const userStreakEl = document.getElementById('userStreak');
        if (userStreakEl) {
            userStreakEl.textContent = this.currentUser.streak || 1;
        }
    }

    updateUserStats() {
        if (!this.currentUser) {
            console.warn('No current user for stats update');
            return;
        }
        
        // Safely update user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl && this.currentUser.name) {
            userNameEl.textContent = this.currentUser.name;
        }
        
        // Load tasks for stats calculation
        const tasks = JSON.parse(sessionStorage.getItem('tasks') || localStorage.getItem('tasks') || '[]');
        const completedTasks = tasks.filter(task => task.completed).length;
        
        // Safely update tasks completed
        const tasksCompletedEl = document.getElementById('tasksCompleted');
        if (tasksCompletedEl) {
            tasksCompletedEl.textContent = completedTasks;
        }
        
        // Safely update current streak
        const currentStreakEl = document.getElementById('currentStreak');
        if (currentStreakEl) {
            currentStreakEl.textContent = this.currentUser.streak || 1;
        }
        
        console.log('📊 User stats updated:', { 
            name: this.currentUser.name, 
            completedTasks, 
            streak: this.currentUser.streak || 1 
        });
    }

    async loadTasks() {
        // Prevent multiple simultaneous task loads
        if (this.loadingTasks) {
            console.log('⏳ Tasks already loading, skipping...');
            return;
        }
        
        this.loadingTasks = true;
        
        try {
            if (this.backendAvailable) {
                const response = await this.api.getTasks();
                const tasks = response.tasks || [];
                
                // Sync with sessionStorage for current session functionality
                sessionStorage.setItem('tasks', JSON.stringify(tasks));
                
                // Dispatch event to update UI
                window.dispatchEvent(new CustomEvent('tasksLoaded', { detail: tasks }));
                console.log('✅ Tasks loaded from backend:', tasks.length);
            } else {
                // Load from sessionStorage first, then fallback to localStorage if needed
                let tasks = [];
                const sessionTasks = sessionStorage.getItem('tasks');
                const localTasks = localStorage.getItem('tasks');
                
                if (sessionTasks) {
                    tasks = JSON.parse(sessionTasks);
                } else if (localTasks) {
                    // Migrate from localStorage to sessionStorage
                    tasks = JSON.parse(localTasks);
                    sessionStorage.setItem('tasks', JSON.stringify(tasks));
                    localStorage.removeItem('tasks');
                }
                
                window.dispatchEvent(new CustomEvent('tasksLoaded', { detail: tasks }));
                console.log('✅ Tasks loaded from storage:', tasks.length);
            }
        } catch (error) {
            console.warn('Failed to load tasks from backend, using local storage:', error);
            let tasks = [];
            const sessionTasks = sessionStorage.getItem('tasks');
            const localTasks = localStorage.getItem('tasks');
            
            if (sessionTasks) {
                tasks = JSON.parse(sessionTasks);
            } else if (localTasks) {
                tasks = JSON.parse(localTasks);
                sessionStorage.setItem('tasks', JSON.stringify(tasks));
                localStorage.removeItem('tasks');
            }
            
            window.dispatchEvent(new CustomEvent('tasksLoaded', { detail: tasks }));
            console.log('✅ Tasks loaded from fallback storage:', tasks.length);
        } finally {
            this.loadingTasks = false;
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
