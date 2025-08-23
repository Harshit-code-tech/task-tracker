#!/bin/bash

# Deployment Security Check Script
# This script helps ensure your deployment is secure and legitimate

echo "🔥 ProductiveFire Deployment Security Check"
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check for security files
echo "🔍 Checking security files..."

if [ -f "robots.txt" ]; then
    echo "✅ robots.txt found"
else
    echo "❌ robots.txt missing"
fi

if [ -f ".well-known/security.txt" ]; then
    echo "✅ security.txt found"
else
    echo "❌ security.txt missing"
fi

# Check environment variables
echo "🔍 Checking environment variables..."
if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET not set - using default (not recommended for production)"
else
    echo "✅ JWT_SECRET configured"
fi

if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  MONGODB_URI not set"
else
    echo "✅ MONGODB_URI configured"
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🔗 Your site: https://task-tracker-omega-orcin.vercel.app/"
echo ""
echo "🛡️  Security Tips:"
echo "   - Monitor Google Safe Browsing status"
echo "   - Keep dependencies updated"
echo "   - Review security headers regularly"
echo "   - Use consistent domain for authentication"
echo ""
echo "📊 Post-deployment checks:"
echo "   1. Visit https://task-tracker-omega-orcin.vercel.app/health"
echo "   2. Check https://task-tracker-omega-orcin.vercel.app/domain-verification"
echo "   3. Test authentication flow"
