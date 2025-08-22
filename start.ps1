# ProductiveFire Task Tracker Startup Script

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   🔥 ProductiveFire Task Tracker" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting ProductiveFire Task Tracker..." -ForegroundColor Yellow
Write-Host ""

# Get script directory and navigate to backend
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"

Set-Location $backendPath

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔥 Starting backend server..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'ProductiveFire Backend Server' -ForegroundColor Green; node server.js"

Write-Host ""
Write-Host "⏰ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🌐 Backend started! You can now:" -ForegroundColor Green
Write-Host "  1. Open your browser to http://localhost:5500 (if using Live Server)" -ForegroundColor White
Write-Host "  2. Or open index.html with any local server" -ForegroundColor White
Write-Host "  3. Backend API is available at http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "💡 To start frontend:" -ForegroundColor Yellow
Write-Host "  - Use VS Code Live Server extension (recommended)" -ForegroundColor White
Write-Host "  - Or run: python -m http.server 8080" -ForegroundColor White
Write-Host "  - Or run: npx http-server -p 8080" -ForegroundColor White
Write-Host ""

# Ask if user wants to start a simple HTTP server for frontend
$response = Read-Host "Would you like to start a simple HTTP server for the frontend? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Set-Location ..
    Write-Host "🌐 Starting frontend server on http://localhost:8080..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'ProductiveFire Frontend Server' -ForegroundColor Blue; Write-Host 'Open http://localhost:8080 in your browser' -ForegroundColor Yellow; python -m http.server 8080"
}

Write-Host ""
Write-Host "✨ Setup complete! Happy productivity!" -ForegroundColor Green
Read-Host "Press Enter to exit"
