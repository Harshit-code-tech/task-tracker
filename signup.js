// Signup page logic with OTP verification
class SignupManager {
    constructor() {
        this.currentStep = 1; // 1: form, 2: otp verification
        this.userEmail = '';
        this.userName = '';
        this.userPassword = '';
        this.otpTimer = null;
        this.otpTimeLeft = 600; // 10 minutes in seconds
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        // Forms
        this.signupForm = document.getElementById('signUpForm'); // Fixed ID
        this.otpVerificationModal = document.getElementById('otpModal'); // Fixed ID
        
        // Inputs
        this.nameInput = document.getElementById('fullName'); // Fixed ID
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.otpInputs = document.querySelectorAll('.otp-input');
        
        // Buttons
        this.signupBtn = document.getElementById('signUpBtn'); // Fixed ID
        this.verifyOtpBtn = document.getElementById('verifyOtpBtn');
        this.resendOtpBtn = document.getElementById('resendOtp');
        
        // Display elements
        this.sentToEmailDisplay = document.getElementById('verificationEmail'); // Fixed ID
        this.otpTimerDisplay = document.getElementById('otpTimer');
        
        // Password strength elements
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        
        // Error elements
        this.nameError = document.getElementById('fullNameError'); // Fixed ID
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        this.confirmPasswordError = document.getElementById('confirmPasswordError');
        this.otpError = document.getElementById('otpError');
    }
    
    attachEventListeners() {
        // Form submission
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleSignupSubmit(e));
        }
        
        // OTP modal form
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => this.handleOtpSubmit(e));
        }
        
        // Real-time validation
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => this.validateName());
            this.nameInput.addEventListener('focus', () => AuthUtils.clearError('fullNameError'));
        }
        
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => this.validateEmail());
            this.emailInput.addEventListener('focus', () => AuthUtils.clearError('emailError'));
        }
        
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', () => this.validatePassword());
            this.passwordInput.addEventListener('focus', () => AuthUtils.clearError('passwordError'));
        }
        
        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
            this.confirmPasswordInput.addEventListener('focus', () => AuthUtils.clearError('confirmPasswordError'));
        }
        
        // OTP input handling
        this.setupOtpInputs();
        
        // Buttons
        if (this.resendOtpBtn) {
            this.resendOtpBtn.addEventListener('click', () => this.resendOtp());
        }
        
        // Toggle password visibility
        const togglePasswordBtn = document.getElementById('togglePasswordBtn');
        const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');
        
        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', () => this.togglePassword('password', 'toggleIcon1'));
        }
        
        if (toggleConfirmPasswordBtn) {
            toggleConfirmPasswordBtn.addEventListener('click', () => this.togglePassword('confirmPassword', 'toggleIcon2'));
        }
        
        // Clear errors on focus
        [this.nameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput].forEach(input => {
            input.addEventListener('focus', () => {
                const errorId = input.id + 'Error';
                AuthUtils.clearError(errorId);
            });
        });
    }
    
    setupOtpInputs() {
        this.otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Only allow numbers
                if (!/^\d$/.test(value) && value !== '') {
                    e.target.value = '';
                    return;
                }
                
                // Move to next input
                if (value && index < this.otpInputs.length - 1) {
                    this.otpInputs[index + 1].focus();
                }
                
                AuthUtils.clearError('otpError');
            });
            
            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    this.otpInputs[index - 1].focus();
                }
            });
            
            input.addEventListener('focus', () => AuthUtils.clearError('otpError'));
        });
    }
    
    validateName() {
        const name = this.nameInput.value.trim();
        
        if (name.length < 2) {
            AuthUtils.showError('nameError', 'Name must be at least 2 characters');
            return false;
        }
        
        AuthUtils.clearError('nameError');
        return true;
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        
        if (!AuthUtils.validateEmail(email)) {
            AuthUtils.showError('emailError', 'Please enter a valid email address');
            return false;
        }
        
        AuthUtils.clearError('emailError');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        const strength = AuthUtils.checkPasswordStrength(password);
        
        // Update strength indicator
        this.strengthFill.style.width = `${strength.percentage}%`;
        this.strengthFill.style.backgroundColor = strength.color;
        this.strengthText.textContent = strength.level;
        this.strengthText.style.color = strength.color;
        
        if (strength.score < 3) {
            const missing = strength.feedback.join(', ');
            AuthUtils.showError('passwordError', `Password needs: ${missing}`);
            return false;
        }
        
        AuthUtils.clearError('passwordError');
        return true;
    }
    
    validatePasswordMatch() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            AuthUtils.showError('confirmPasswordError', 'Passwords do not match');
            return false;
        }
        
        AuthUtils.clearError('confirmPasswordError');
        return true;
    }
    
    validateForm() {
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        const confirmPasswordValid = this.validatePasswordMatch();
        
        return nameValid && emailValid && passwordValid && confirmPasswordValid;
    }
    
    async handleSignupSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.userName = this.nameInput.value.trim();
        this.userEmail = this.emailInput.value.trim();
        this.userPassword = this.passwordInput.value;
        
        AuthUtils.showLoading('signupBtn');
        
        try {
            // Send OTP first
            const response = await AuthUtils.makeRequest('/auth/send-signup-otp', {
                method: 'POST',
                body: JSON.stringify({ email: this.userEmail })
            });
            
            if (response.success) {
                // Store temporary verification data
                sessionStorage.setItem('verification_email', this.userEmail);
                sessionStorage.setItem('verification_name', this.userName);
                sessionStorage.setItem('verification_password', this.userPassword);
                
                toast.show('success', 'Verification code sent! Redirecting to verification page...');
                
                // Redirect to verification page
                setTimeout(() => {
                    window.location.href = `verify-email.html?email=${encodeURIComponent(this.userEmail)}&name=${encodeURIComponent(this.userName)}`;
                }, 1500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            AuthUtils.showError('emailError', error.message || 'Failed to send verification code');
        } finally {
            AuthUtils.hideLoading('signupBtn');
        }
    }
    
    async handleOtpSubmit(e) {
        e.preventDefault();
        
        const otp = this.getOtpValue();
        
        if (otp.length !== 6) {
            AuthUtils.showError('otpError', 'Please enter the complete 6-digit code');
            return;
        }
        
        AuthUtils.showLoading('verifyOtpBtn');
        
        try {
            const response = await AuthUtils.makeRequest('/auth/verify-signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: this.userEmail,
                    otp: otp,
                    name: this.userName,
                    password: this.userPassword
                })
            });
            
            if (response.success) {
                // Store user data and token
                AuthUtils.setUserData(response.user);
                AuthUtils.setToken(response.token);
                
                toast.show('success', 'Account created successfully! Welcome to ProductiveFire!');
                
                // Redirect to main app after a short delay
                setTimeout(() => {
                    AuthUtils.redirectToApp();
                }, 1500);
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            AuthUtils.showError('otpError', error.message || 'Invalid or expired verification code');
            this.clearOtpInputs();
        } finally {
            AuthUtils.hideLoading('verifyOtpBtn');
        }
    }
    
    async resendOtp() {
        AuthUtils.showLoading('resendOtp');
        
        try {
            const response = await AuthUtils.makeRequest('/auth/send-signup-otp', {
                method: 'POST',
                body: JSON.stringify({ email: this.userEmail })
            });
            
            if (response.success) {
                this.clearOtpInputs();
                this.resetOtpTimer();
                this.startOtpTimer();
                toast.show('success', 'New verification code sent!');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.show('error', error.message || 'Failed to resend code');
        } finally {
            AuthUtils.hideLoading('resendOtp');
        }
    }
    
    showOtpModal() {
        this.sentToEmailDisplay.textContent = this.userEmail;
        this.otpVerificationModal.classList.add('show');
        this.otpInputs[0].focus();
    }
    
    hideOtpModal() {
        this.otpVerificationModal.classList.remove('show');
        this.stopOtpTimer();
    }
    
    startOtpTimer() {
        this.otpTimeLeft = 600; // 10 minutes
        this.updateTimerDisplay();
        
        this.otpTimer = setInterval(() => {
            this.otpTimeLeft--;
            this.updateTimerDisplay();
            
            if (this.otpTimeLeft <= 0) {
                this.stopOtpTimer();
                AuthUtils.showError('otpError', 'Verification code has expired. Please request a new one.');
            }
        }, 1000);
    }
    
    stopOtpTimer() {
        if (this.otpTimer) {
            clearInterval(this.otpTimer);
            this.otpTimer = null;
        }
    }
    
    resetOtpTimer() {
        this.stopOtpTimer();
        this.otpTimeLeft = 600;
        AuthUtils.clearError('otpError');
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.otpTimeLeft / 60);
        const seconds = this.otpTimeLeft % 60;
        this.otpTimerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    getOtpValue() {
        return Array.from(this.otpInputs).map(input => input.value).join('');
    }
    
    clearOtpInputs() {
        this.otpInputs.forEach(input => input.value = '');
        this.otpInputs[0].focus();
    }
    
    togglePassword(inputId, iconId) {
        const passwordInput = document.getElementById(inputId);
        const toggleIcon = document.getElementById(iconId);
        
        if (passwordInput && toggleIcon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }
    }
}

// Initialize signup manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupManager();
});
