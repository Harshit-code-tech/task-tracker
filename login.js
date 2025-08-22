// Login page logic
class LoginManager {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        // Form elements
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.loginBtn = document.getElementById('loginBtn');
        
        // Error elements
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        this.generalError = document.getElementById('generalError');
    }
    
    attachEventListeners() {
        // Form submission
        this.loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        
        // Real-time validation
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        
        // Clear errors on focus
        this.emailInput.addEventListener('focus', () => AuthUtils.clearError('emailError'));
        this.passwordInput.addEventListener('focus', () => AuthUtils.clearError('passwordError'));
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        
        if (!email) {
            AuthUtils.showError('emailError', 'Email is required');
            return false;
        }
        
        if (!AuthUtils.validateEmail(email)) {
            AuthUtils.showError('emailError', 'Please enter a valid email address');
            return false;
        }
        
        AuthUtils.clearError('emailError');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            AuthUtils.showError('passwordError', 'Password is required');
            return false;
        }
        
        AuthUtils.clearError('passwordError');
        return true;
    }
    
    validateForm() {
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        
        return emailValid && passwordValid;
    }
    
    async handleLoginSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberMeCheckbox.checked;
        
        AuthUtils.showLoading('loginBtn');
        
        try {
            const response = await AuthUtils.makeRequest('/api/auth/signin', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (response.success) {
                // Store user data and token
                AuthUtils.setUserData(response.user);
                AuthUtils.setToken(response.token);
                
                // If remember me is checked, store in localStorage with longer expiry
                if (rememberMe) {
                    localStorage.setItem('productivefire_remember', 'true');
                } else {
                    // For session-only, we could use sessionStorage instead
                    // But for simplicity, we'll still use localStorage
                    localStorage.removeItem('productivefire_remember');
                }
                
                toast.show('success', `Welcome back, ${response.user.name}!`);
                
                // Redirect to main app after a short delay
                setTimeout(() => {
                    AuthUtils.redirectToApp();
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Show specific error messages
            if (error.message.includes('Invalid credentials')) {
                AuthUtils.showError('passwordError', 'Invalid email or password');
            } else if (error.message.includes('email')) {
                AuthUtils.showError('emailError', error.message);
            } else {
                toast.show('error', error.message || 'Login failed. Please try again.');
            }
        } finally {
            AuthUtils.hideLoading('loginBtn');
        }
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});
