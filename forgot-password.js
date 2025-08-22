// Forgot Password Flow Management
class ForgotPasswordManager {
    constructor() {
        this.currentStep = 1; // 1: email, 2: otp, 3: reset
        this.userEmail = '';
        this.otpTimer = null;
        this.otpTimeLeft = 600; // 10 minutes in seconds
        this.resetToken = '';
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        // Forms
        this.emailForm = document.getElementById('emailForm');
        this.otpForm = document.getElementById('otpForm');
        this.resetForm = document.getElementById('resetForm');
        
        // Buttons
        this.sendCodeBtn = document.getElementById('sendCodeBtn');
        this.verifyCodeBtn = document.getElementById('verifyCodeBtn');
        this.resetPasswordBtn = document.getElementById('resetPasswordBtn');
        this.resendCodeBtn = document.getElementById('resendCode');
        this.backToEmailBtn = document.getElementById('backToEmail');
        
        // Inputs
        this.emailInput = document.getElementById('email');
        this.otpInputs = document.querySelectorAll('.otp-input');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmNewPasswordInput = document.getElementById('confirmNewPassword');
        
        // Display elements
        this.sentToEmailDisplay = document.getElementById('sentToEmail');
        this.otpTimerDisplay = document.getElementById('otpTimer');
        
        // Error displays
        this.emailError = document.getElementById('emailError');
        this.otpError = document.getElementById('otpError');
        this.newPasswordError = document.getElementById('newPasswordError');
        this.confirmNewPasswordError = document.getElementById('confirmNewPasswordError');
    }
    
    attachEventListeners() {
        // Form submissions
        this.emailForm.addEventListener('submit', (e) => this.handleEmailSubmit(e));
        this.otpForm.addEventListener('submit', (e) => this.handleOtpSubmit(e));
        this.resetForm.addEventListener('submit', (e) => this.handleResetSubmit(e));
        
        // Navigation buttons
        this.resendCodeBtn.addEventListener('click', () => this.resendOtp());
        this.backToEmailBtn.addEventListener('click', () => this.goToStep(1));
        
        // OTP input handling
        this.setupOtpInputs();
        
        // Password strength checking
        this.newPasswordInput.addEventListener('input', () => this.checkPasswordStrength());
        this.confirmNewPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
        
        // Real-time validation
        this.emailInput.addEventListener('input', () => this.clearError('emailError'));
        this.newPasswordInput.addEventListener('input', () => this.clearError('newPasswordError'));
        this.confirmNewPasswordInput.addEventListener('input', () => this.clearError('confirmNewPasswordError'));
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
                
                this.clearError('otpError');
            });
            
            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    this.otpInputs[index - 1].focus();
                }
            });
            
            // Clear error on focus
            input.addEventListener('focus', () => this.clearError('otpError'));
        });
    }
    
    async handleEmailSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            return;
        }
        
        this.showLoading('sendCodeBtn');
        
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.userEmail = email;
                this.sentToEmailDisplay.textContent = email;
                this.startOtpTimer();
                this.goToStep(2);
                this.showToast('success', 'Reset code sent to your email!');
            } else {
                this.showError('emailError', result.message || 'Email not found');
            }
        } catch (error) {
            console.error('Error sending reset code:', error);
            this.showError('emailError', 'Failed to send reset code. Please try again.');
        } finally {
            this.hideLoading('sendCodeBtn');
        }
    }
    
    async handleOtpSubmit(e) {
        e.preventDefault();
        
        const otp = this.getOtpValue();
        
        if (otp.length !== 6) {
            this.showError('otpError', 'Please enter the complete 6-digit code');
            return;
        }
        
        this.showLoading('verifyCodeBtn');
        
        try {
            const response = await fetch('/api/auth/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: this.userEmail,
                    otp: otp 
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.resetToken = result.resetToken;
                this.stopOtpTimer();
                this.goToStep(3);
                this.showToast('success', 'Code verified successfully!');
            } else {
                this.showError('otpError', result.message || 'Invalid or expired code');
                this.clearOtpInputs();
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            this.showError('otpError', 'Failed to verify code. Please try again.');
        } finally {
            this.hideLoading('verifyCodeBtn');
        }
    }
    
    async handleResetSubmit(e) {
        e.preventDefault();
        
        const newPassword = this.newPasswordInput.value;
        const confirmPassword = this.confirmNewPasswordInput.value;
        
        if (!this.validateNewPassword(newPassword, confirmPassword)) {
            return;
        }
        
        this.showLoading('resetPasswordBtn');
        
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    resetToken: this.resetToken,
                    newPassword: newPassword 
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showToast('success', 'Password reset successfully!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showError('newPasswordError', result.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            this.showError('newPasswordError', 'Failed to reset password. Please try again.');
        } finally {
            this.hideLoading('resetPasswordBtn');
        }
    }
    
    async resendOtp() {
        this.showLoading('resendCode');
        
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: this.userEmail })
            });
            
            if (response.ok) {
                this.clearOtpInputs();
                this.resetOtpTimer();
                this.startOtpTimer();
                this.showToast('success', 'New code sent to your email!');
            } else {
                this.showToast('error', 'Failed to resend code. Please try again.');
            }
        } catch (error) {
            console.error('Error resending code:', error);
            this.showToast('error', 'Failed to resend code. Please try again.');
        } finally {
            this.hideLoading('resendCode');
        }
    }
    
    goToStep(step) {
        // Hide all forms
        this.emailForm.style.display = 'none';
        this.otpForm.style.display = 'none';
        this.resetForm.style.display = 'none';
        
        // Show target form
        switch(step) {
            case 1:
                this.emailForm.style.display = 'block';
                this.currentStep = 1;
                this.stopOtpTimer();
                break;
            case 2:
                this.otpForm.style.display = 'block';
                this.currentStep = 2;
                this.otpInputs[0].focus();
                break;
            case 3:
                this.resetForm.style.display = 'block';
                this.currentStep = 3;
                this.newPasswordInput.focus();
                break;
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
                this.showError('otpError', 'Code has expired. Please request a new one.');
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
        this.clearError('otpError');
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
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validateNewPassword(password, confirmPassword) {
        let isValid = true;
        
        // Check password strength
        if (password.length < 8) {
            this.showError('newPasswordError', 'Password must be at least 8 characters long');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            this.showError('newPasswordError', 'Password must contain uppercase, lowercase, and number');
            isValid = false;
        }
        
        // Check password match
        if (password !== confirmPassword) {
            this.showError('confirmNewPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        return isValid;
    }
    
    checkPasswordStrength() {
        const password = this.newPasswordInput.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;
        let strengthLabel = '';
        let strengthColor = '';
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        switch (strength) {
            case 0:
            case 1:
                strengthLabel = 'Very Weak';
                strengthColor = '#ef4444';
                break;
            case 2:
                strengthLabel = 'Weak';
                strengthColor = '#f97316';
                break;
            case 3:
                strengthLabel = 'Medium';
                strengthColor = '#eab308';
                break;
            case 4:
                strengthLabel = 'Strong';
                strengthColor = '#22c55e';
                break;
            case 5:
                strengthLabel = 'Very Strong';
                strengthColor = '#10b981';
                break;
        }
        
        strengthFill.style.width = `${(strength / 5) * 100}%`;
        strengthFill.style.backgroundColor = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
    }
    
    validatePasswordMatch() {
        const password = this.newPasswordInput.value;
        const confirmPassword = this.confirmNewPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('confirmNewPasswordError', 'Passwords do not match');
        } else {
            this.clearError('confirmNewPasswordError');
        }
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        button.disabled = true;
    }
    
    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }
    
    showToast(type, message) {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageElement = toast.querySelector('.toast-message');
        
        // Set icon and styling based on type
        if (type === 'success') {
            icon.className = 'toast-icon fas fa-check-circle';
            toast.className = 'toast toast-success show';
        } else {
            icon.className = 'toast-icon fas fa-exclamation-circle';
            toast.className = 'toast toast-error show';
        }
        
        messageElement.textContent = message;
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Password toggle function
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

// Initialize forgot password manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ForgotPasswordManager();
});
