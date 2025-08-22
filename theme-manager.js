// Premium Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('app-theme') || 'light';
        this.initializeTheme();
        this.setupThemeToggle();
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeToggle();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('app-theme', this.currentTheme);
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = this.currentTheme === 'dark';
        }
    }

    setupThemeToggle() {
        document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('change', () => this.toggleTheme());
            }
        });
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
