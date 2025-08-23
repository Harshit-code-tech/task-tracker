# ProductiveFire Deployment Security Check Script (PowerShell)
# This script helps ensure your deployment is secure and legitimate

Write-Host "🔥 ProductiveFire Deployment Security Check" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow

# Check if we're in the right directory
if (!(Test-Path "vercel.json")) {
    Write-Host "❌ Error: Not in project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check for security files
Write-Host "🔍 Checking security files..." -ForegroundColor Cyan

if (Test-Path "robots.txt") {
    Write-Host "✅ robots.txt found" -ForegroundColor Green
} else {
    Write-Host "❌ robots.txt missing" -ForegroundColor Red
}

if (Test-Path ".well-known/security.txt") {
    Write-Host "✅ security.txt found" -ForegroundColor Green
} else {
    Write-Host "❌ security.txt missing" -ForegroundColor Red
}

# Check environment variables
Write-Host "🔍 Checking environment variables..." -ForegroundColor Cyan
if ([string]::IsNullOrEmpty($env:JWT_SECRET)) {
    Write-Host "⚠️  JWT_SECRET not set - using default (not recommended for production)" -ForegroundColor Yellow
} else {
    Write-Host "✅ JWT_SECRET configured" -ForegroundColor Green
}

if ([string]::IsNullOrEmpty($env:MONGODB_URI)) {
    Write-Host "⚠️  MONGODB_URI not set" -ForegroundColor Yellow
} else {
    Write-Host "✅ MONGODB_URI configured" -ForegroundColor Green
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Your site: https://task-tracker-omega-orcin.vercel.app/" -ForegroundColor Blue
Write-Host ""
Write-Host "🛡️  Security Tips:" -ForegroundColor Yellow
Write-Host "   - Monitor Google Safe Browsing status"
Write-Host "   - Keep dependencies updated" 
Write-Host "   - Review security headers regularly"
Write-Host "   - Use consistent domain for authentication"
Write-Host ""
Write-Host "📊 Post-deployment checks:" -ForegroundColor Cyan
Write-Host "   1. Visit https://task-tracker-omega-orcin.vercel.app/health"
Write-Host "   2. Check https://task-tracker-omega-orcin.vercel.app/domain-verification"
Write-Host "   3. Test authentication flow"
