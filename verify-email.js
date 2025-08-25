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
        // Get user data from URL parameters or sessionStorage
        const urlParams = new URLSearchParams(window.location.search);
        this.userEmail = urlParams.get('email') || sessionStorage.getItem('verification_email');
        this.userName = urlParams.get('name') || sessionStorage.getItem('verification_name');
        this.userPassword = sessionStorage.getItem('verification_password');
        
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
            // Set input type to text to avoid number input issues
            input.type = 'text';
            input.inputMode = 'numeric';
            input.pattern = '[0-9]*';
            
            input.addEventListener('input', (e) => {
                let value = e.target.value;
                
                // Remove any non-numeric characters
                value = value.replace(/\D/g, '');
                
                // Take only the first digit if multiple entered
                if (value.length > 1) {
                    value = value.charAt(0);
                }
                
                e.target.value = value;
                
                // Move to next input if value entered and not last input
                if (value && index < this.otpInputs.length - 1) {
                    this.otpInputs[index + 1].focus();
                }
                
                // Clear any previous errors
                AuthUtils.clearError('otpError');
            });
            
            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace if current is empty
                if (e.key === 'Backspace') {
                    if (!e.target.value && index > 0) {
                        this.otpInputs[index - 1].focus();
                        // Also clear the previous input
                        this.otpInputs[index - 1].value = '';
                    }
                }
                
                // Handle arrow keys for navigation
                if (e.key === 'ArrowLeft' && index > 0) {
                    this.otpInputs[index - 1].focus();
                }
                if (e.key === 'ArrowRight' && index < this.otpInputs.length - 1) {
                    this.otpInputs[index + 1].focus();
                }
                
                // Prevent non-numeric input except backspace, delete, tab, and arrow keys
                if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                }
            });
            
            // Handle paste events
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
                
                if (pastedData) {
                    // Fill inputs with pasted digits
                    for (let i = 0; i < Math.min(pastedData.length, this.otpInputs.length - index); i++) {
                        if (index + i < this.otpInputs.length) {
                            this.otpInputs[index + i].value = pastedData.charAt(i);
                        }
                    }
                    
                    // Focus the next empty input or last input
                    const nextEmptyIndex = Math.min(index + pastedData.length, this.otpInputs.length - 1);
                    this.otpInputs[nextEmptyIndex].focus();
                }
            });
            
            // Clear error on focus
            input.addEventListener('focus', () => {
                AuthUtils.clearError('otpError');
                // Select all text for easier replacement
                input.select();
            });
            
            // Ensure proper display
            input.addEventListener('blur', () => {
                // Re-validate the input value
                const value = input.value.replace(/\D/g, '');
                input.value = value;
            });
        });
        
        // Focus first input initially
        if (this.otpInputs[0]) {
            this.otpInputs[0].focus();
        }
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
            } else if (error.message.includes('expired')) {
                AuthUtils.showError('otpError', 'Verification code has expired. Please request a new code.');
                this.clearOtpInputs();
                // Auto-focus on resend button
                setTimeout(() => {
                    const resendBtn = document.getElementById('resendOtp');
                    if (resendBtn) resendBtn.focus();
                }, 1000);
            } else if (error.message.includes('No verification code found')) {
                AuthUtils.showError('otpError', 'No verification code found. Please request a new code.');
                this.clearOtpInputs();
                // Auto-focus on resend button
                setTimeout(() => {
                    const resendBtn = document.getElementById('resendOtp');
                    if (resendBtn) resendBtn.focus();
                }, 1000);
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
                body: JSON.stringify({ 
                    email: this.userEmail,
                    isResend: true  // Indicate this is a resend request
                })
            });
            
            if (response.success) {
                this.clearOtpInputs();
                this.resetOtpTimer();
                this.startOtpTimer();
                toast.show('success', 'New verification code sent to your email!');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            
            // Handle specific error messages
            if (error.message.includes('User already exists')) {
                // This shouldn't happen with the updated backend, but handle gracefully
                toast.show('error', 'Account verification in progress. Please check your email for the latest code.');
            } else {
                toast.show('error', error.message || 'Failed to resend code. Please try again.');
            }
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
        sessionStorage.removeItem('verification_email');
        sessionStorage.removeItem('verification_name');
        sessionStorage.removeItem('verification_password');
        // Also clear any localStorage items from old versions
        localStorage.removeItem('verification_email');
        localStorage.removeItem('verification_name');
        localStorage.removeItem('verification_password');
    }
}

// Initialize verification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailVerificationManager();
});
