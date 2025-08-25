// Common auth utilities and functions shared across auth pages

// Toast notification system
class ToastManager {
    constructor() {
        this.createToastContainer();
    }
    
    createToastContainer() {
        if (!document.getElementById('toast')) {
            const toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="toast-icon"></i>
                    <span class="toast-message"></span>
                </div>
            `;
            document.body.appendChild(toast);
        }
    }
    
    show(type, message, duration = 4000) {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageElement = toast.querySelector('.toast-message');
        
        // Set icon and styling based on type
        if (type === 'success') {
            icon.className = 'toast-icon fas fa-check-circle';
            toast.className = 'toast toast-success show';
        } else if (type === 'error') {
            icon.className = 'toast-icon fas fa-exclamation-circle';
            toast.className = 'toast toast-error show';
        } else if (type === 'warning') {
            icon.className = 'toast-icon fas fa-exclamation-triangle';
            toast.className = 'toast toast-warning show';
        } else {
            icon.className = 'toast-icon fas fa-info-circle';
            toast.className = 'toast toast-info show';
        }
        
        messageElement.textContent = message;
        
        // Auto hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// Initialize toast manager
const toast = new ToastManager();

// Utility functions
const AuthUtils = {
    // Email validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Password strength checking
    checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];
        
        if (password.length >= 8) {
            strength++;
        } else {
            feedback.push('At least 8 characters');
        }
        
        if (/[a-z]/.test(password)) {
            strength++;
        } else {
            feedback.push('Lowercase letter');
        }
        
        if (/[A-Z]/.test(password)) {
            strength++;
        } else {
            feedback.push('Uppercase letter');
        }
        
        if (/\d/.test(password)) {
            strength++;
        } else {
            feedback.push('Number');
        }
        
        if (/[^a-zA-Z\d]/.test(password)) {
            strength++;
        } else {
            feedback.push('Special character');
        }
        
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
        
        return {
            score: strength,
            level: levels[Math.min(strength, 4)],
            color: colors[Math.min(strength, 4)],
            feedback: feedback,
            percentage: (strength / 5) * 100
        };
    },
    
    // Show/hide error messages
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },
    
    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    },
    
    // Loading state management
    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const btnText = button.querySelector('.btn-text');
            const btnLoading = button.querySelector('.btn-loading');
            
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';
            button.disabled = true;
        }
    },
    
    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const btnText = button.querySelector('.btn-text');
            const btnLoading = button.querySelector('.btn-loading');
            
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
            button.disabled = false;
        }
    },
    
    // Detect base URL for different environments
    getBaseURL() {
        if (typeof window !== 'undefined') {
            // Browser environment
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Local development - use http for localhost
                return 'http://localhost:3001/api';
            } else {
                // Production - always use https for external domains
                const protocol = window.location.protocol === 'http:' && window.location.hostname !== 'localhost' ? 'https:' : window.location.protocol;
                return `${protocol}//${window.location.host}/api`;
            }
        }
        // Fallback for server-side or unknown environment
        return '/api';
    },
    
    // API request helper
    async makeRequest(url, options = {}) {
        try {
            // Add base URL if not already present
            const fullUrl = url.startsWith('http') ? url : `${this.getBaseURL()}${url}`;
            
            const response = await fetch(fullUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            // Handle rate limiting (429) with proper error message
            if (response.status === 429) {
                throw new Error('Too many requests. Please wait a few minutes before trying again.');
            }
            
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                // If JSON parsing fails, handle non-JSON responses (like rate limit plain text)
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a few minutes before trying again.');
                }
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            
            if (!response.ok) {
                throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },
    
    // Session storage helpers (more secure, cleared on browser close)
    setUserData(userData) {
        // Store in both sessionStorage and localStorage for consistency
        const userDataStr = JSON.stringify(userData);
        sessionStorage.setItem('productivefire_user', userDataStr);
        sessionStorage.setItem('taskTrackerCurrentUser', userDataStr);
        localStorage.setItem('productivefire_user', userDataStr);
        localStorage.setItem('taskTrackerCurrentUser', userDataStr);
    },
    
    getUserData() {
        // Check all possible user data storage locations for compatibility
        const data = sessionStorage.getItem('productivefire_user') || 
                    sessionStorage.getItem('taskTrackerCurrentUser') ||
                    localStorage.getItem('productivefire_user') ||
                    localStorage.getItem('taskTrackerCurrentUser');
        return data ? JSON.parse(data) : null;
    },
    
    clearUserData() {
        // Clear all possible storage locations
        sessionStorage.removeItem('productivefire_user');
        sessionStorage.removeItem('taskTrackerCurrentUser');
        sessionStorage.removeItem('productivefire_token');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('verification_email');
        sessionStorage.removeItem('verification_name');
        sessionStorage.removeItem('verification_password');
        
        // Also clear localStorage items for consistency
        localStorage.removeItem('productivefire_user');
        localStorage.removeItem('taskTrackerCurrentUser');
        localStorage.removeItem('productivefire_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('verification_email');
        localStorage.removeItem('verification_name');
        localStorage.removeItem('verification_password');
    },
    
    setToken(token) {
        // Store in both sessionStorage and localStorage for consistency
        sessionStorage.setItem('productivefire_token', token);
        sessionStorage.setItem('authToken', token);
        localStorage.setItem('productivefire_token', token);
        localStorage.setItem('authToken', token);
    },
    
    getToken() {
        // Check all possible token storage locations for compatibility
        return sessionStorage.getItem('productivefire_token') || 
               sessionStorage.getItem('authToken') ||
               localStorage.getItem('productivefire_token') ||
               localStorage.getItem('authToken');
    },
    
    // Redirect helper
    redirectToApp() {
        window.location.href = 'index.html';
    },
    
    redirectToLogin() {
        window.location.href = 'home.html';
    }
};

// Password toggle function (global)
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = AuthUtils.getToken();
    const userData = AuthUtils.getUserData();
    
    console.log('🔍 Auth Check:', { 
        token: token ? 'exists' : 'null', 
        userData: userData ? 'exists' : 'null',
        currentPage: window.location.pathname.split('/').pop()
    });

    // If on auth pages and already logged in, redirect to app
    const authPages = ['login.html', 'signup.html', 'forgot-password.html', 'verify-email.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (token && userData && authPages.includes(currentPage)) {
        // Don't redirect if BackendUserAuth signin is in progress
        if (sessionStorage.getItem('backend_signin_complete')) {
            console.log('🔄 Backend signin in progress, skipping auth-common redirect');
            sessionStorage.removeItem('backend_signin_complete');
            return;
        }
        
        console.log('🔄 User already logged in, redirecting to app...');
        // Use a flag to prevent infinite redirects
        if (!sessionStorage.getItem('redirect_in_progress')) {
            sessionStorage.setItem('redirect_in_progress', 'true');
            setTimeout(() => {
                sessionStorage.removeItem('redirect_in_progress');
                AuthUtils.redirectToApp();
            }, 100);
        }
    } else if (authPages.includes(currentPage)) {
        console.log('👤 No valid session found, staying on auth page');
    }
    
    // Send auth check to server log (moved to end to avoid blocking)
    setTimeout(() => {
        const apiBaseUrl = window.location.origin;
        fetch(`${apiBaseUrl}/api/auth/log-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hasToken: !!token,
                hasUserData: !!userData,
                page: window.location.pathname.split('/').pop()
            })
        }).catch(() => {}); // Ignore errors for logging
    }, 200);
});
