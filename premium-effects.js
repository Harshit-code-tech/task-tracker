// Enhanced Premium Effects Manager
class PremiumEffects {
    constructor() {
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.createParticleBackground();
        this.setupRippleEffects();
        this.setupFloatingAnimations();
        this.setupGlowEffects();
        this.startParticleAnimation();
    }

    createParticleBackground() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-bg';
        document.body.appendChild(particlesContainer);

        // Create fewer, more elegant particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and animation delay
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        
        // Random size
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        container.appendChild(particle);
        
        // Remove and recreate after animation
        setTimeout(() => {
            if (container.contains(particle)) {
                container.removeChild(particle);
                this.createParticle(container);
            }
        }, 12000);
    }

    setupRippleEffects() {
        document.addEventListener('click', (e) => {
            const rippleElements = document.querySelectorAll('.ripple');
            rippleElements.forEach(element => {
                if (element.contains(e.target) || element === e.target) {
                    this.createRipple(element, e);
                }
            });
        });
    }

    createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        element.appendChild(ripple);

        setTimeout(() => {
            if (element.contains(ripple)) {
                element.removeChild(ripple);
            }
        }, 600);
    }

    setupFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.float-animation');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = (index * 0.5) + 's';
        });
    }

    setupGlowEffects() {
        // Add glow effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-premium, .morph-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow-primary');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow-primary');
            });
        });
    }

    startParticleAnimation() {
        // Add subtle cursor follow effect
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const createCursorParticle = () => {
            if (Math.random() < 0.1) { // 10% chance
                const particle = document.createElement('div');
                particle.className = 'cursor-particle';
                particle.style.left = mouseX + 'px';
                particle.style.top = mouseY + 'px';
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                }, 1000);
            }
        };

        setInterval(createCursorParticle, 100);
    }

    // Method to add premium effects to new elements
    enhanceElement(element) {
        element.classList.add('morph-card');
        
        if (element.tagName === 'BUTTON') {
            element.classList.add('btn-premium', 'ripple');
        }
        
        if (element.classList.contains('task-card')) {
            element.classList.add('card-3d');
        }
    }

    // Method to create loading animations
    createLoadingAnimation(container) {
        const loading = document.createElement('div');
        loading.className = 'loading-dots';
        loading.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(loading);
        return loading;
    }

    // Method to create shimmer effect for loading states
    addShimmerEffect(element) {
        element.classList.add('shimmer');
        
        setTimeout(() => {
            element.classList.remove('shimmer');
        }, 2000);
    }

    // Theme transition effects
    transitionTheme() {
        const body = document.body;
        body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Create a ripple effect for theme transition
        const ripple = document.createElement('div');
        ripple.className = 'theme-transition-ripple';
        body.appendChild(ripple);
        
        setTimeout(() => {
            body.removeChild(ripple);
            body.style.transition = '';
        }, 500);
    }
}

// Initialize premium effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.premiumEffects = new PremiumEffects();
});

// Enhance the theme manager to use premium effects
if (typeof ThemeManager !== 'undefined') {
    const originalToggleTheme = ThemeManager.prototype.toggleTheme;
    ThemeManager.prototype.toggleTheme = function() {
        if (window.premiumEffects) {
            window.premiumEffects.transitionTheme();
        }
        return originalToggleTheme.call(this);
    };
}
