// Email verification page logic
class EmailVerificationManager {
    constructor() {
        this.userEmail = '';
        this.userName = '';
        this.userPassword = '';
        this.otpTimer = null;
        this.otpTimeLeft = 600; // 10 minutes in seconds
        
        this.initializeElements();
        this.loadUserData();
        this.attachEventListeners();
        this.startOtpTimer();
    }
    
    initializeElements() {
        // Form elements
        this.verificationForm = document.getElementById('otpForm');
        this.otpInputs = document.querySelectorAll('.otp-input');
        this.verifyBtn = document.getElementById('verifyOtpBtn');
        this.resendBtn = document.getElementById('resendOtp');
        
        // Display elements
        this.verificationEmailDisplay = document.getElementById('verificationEmail');
        this.otpTimerDisplay = document.getElementById('otpTimer');
        
        // Error elements
        this.otpError = document.getElementById('otpError');
    }
    
    loadUserData() {
        // Get user data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        this.userEmail = urlParams.get('email') || localStorage.getItem('verification_email');
        this.userName = urlParams.get('name') || localStorage.getItem('verification_name');
        this.userPassword = localStorage.getItem('verification_password');
        
        if (!this.userEmail) {
            toast.show('error', 'No email found for verification. Redirecting to signup...');
            setTimeout(() => {
                window.location.href = 'signup.html';
            }, 2000);
            return;
        }
        
        this.verificationEmailDisplay.textContent = this.userEmail;
    }
    
    attachEventListeners() {
        // Form submission
        this.verificationForm.addEventListener('submit', (e) => this.handleVerificationSubmit(e));
        
        // Button clicks
        this.resendBtn.addEventListener('click', () => this.resendOtp());
        
        // OTP input handling
        this.setupOtpInputs();
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
            
            // Clear error on focus
            input.addEventListener('focus', () => AuthUtils.clearError('otpError'));
        });
        
        // Focus first input
        this.otpInputs[0].focus();
    }
    
    async handleVerificationSubmit(e) {
        e.preventDefault();
        
        const otp = this.getOtpValue();
        
        if (otp.length !== 6) {
            AuthUtils.showError('otpError', 'Please enter the complete 6-digit code');
            return;
        }
        
        if (!this.userName || !this.userPassword) {
            toast.show('error', 'Missing signup data. Please start over.');
            setTimeout(() => {
                window.location.href = 'signup.html';
            }, 2000);
            return;
        }
        
        AuthUtils.showLoading('verifyBtn');
        
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
                
                // Clear temporary verification data
                this.clearVerificationData();
                this.stopOtpTimer();
                
                toast.show('success', 'Email verified successfully! Welcome to ProductiveFire!');
                
                // Redirect to main app after a short delay
                setTimeout(() => {
                    AuthUtils.redirectToApp();
                }, 2000);
            }
        } catch (error) {
            console.error('Verification error:', error);
            
            if (error.message.includes('Invalid or expired')) {
                AuthUtils.showError('otpError', 'Invalid or expired verification code');
                this.clearOtpInputs();
            } else if (error.message.includes('Too many requests')) {
                AuthUtils.showError('otpError', 'Too many attempts. Please wait 15 minutes before trying again.');
                // Disable the button temporarily
                const verifyBtn = document.getElementById('verifyBtn');
                if (verifyBtn) {
                    verifyBtn.disabled = true;
                    verifyBtn.textContent = 'Please wait...';
                    setTimeout(() => {
                        verifyBtn.disabled = false;
                        verifyBtn.textContent = 'Verify Email';
                    }, 60000); // Re-enable after 1 minute
                }
            } else if (error.message.includes('User already exists')) {
                toast.show('error', 'Account already exists. Redirecting to login...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                toast.show('error', error.message || 'Verification failed. Please try again.');
            }
        } finally {
            AuthUtils.hideLoading('verifyBtn');
        }
    }
    
    async resendOtp() {
        AuthUtils.showLoading('resendCode');
        
        try {
            const response = await AuthUtils.makeRequest('/auth/send-signup-otp', {
                method: 'POST',
                body: JSON.stringify({ email: this.userEmail })
            });
            
            if (response.success) {
                this.clearOtpInputs();
                this.resetOtpTimer();
                this.startOtpTimer();
                toast.show('success', 'New verification code sent to your email!');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.show('error', 'Failed to resend code. Please try again.');
        } finally {
            AuthUtils.hideLoading('resendCode');
        }
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
    
    clearVerificationData() {
        localStorage.removeItem('verification_email');
        localStorage.removeItem('verification_name');
        localStorage.removeItem('verification_password');
    }
}

// Initialize verification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailVerificationManager();
});
