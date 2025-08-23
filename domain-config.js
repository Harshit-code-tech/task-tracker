// Domain configuration for deployment consistency
const DomainConfig = {
    // Production domain (consistent across deployments)
    PRODUCTION_DOMAIN: 'https://task-tracker-omega-orcin.vercel.app',
    
    // Get the current domain
    getCurrentDomain() {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return this.PRODUCTION_DOMAIN;
    },
    
    // Check if we're on the production domain
    isProductionDomain() {
        return this.getCurrentDomain().includes('task-tracker-omega-orcin.vercel.app');
    },
    
    // Get API base URL
    getApiBaseUrl() {
        const currentDomain = this.getCurrentDomain();
        // Always use the current domain for API calls to handle preview deployments
        return currentDomain;
    },
    
    // Redirect to production domain if needed
    redirectToProduction() {
        if (typeof window !== 'undefined' && !this.isProductionDomain()) {
            const currentPath = window.location.pathname + window.location.search;
            window.location.href = this.PRODUCTION_DOMAIN + currentPath;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainConfig;
}
