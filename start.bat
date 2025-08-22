@echo off
echo.
echo ====================================
echo    🔥 ProductiveFire Task Tracker
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo 🚀 Starting ProductiveFire Task Tracker...
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

echo 📦 Installing backend dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🔥 Starting backend server...
echo Backend will run on: http://localhost:3001
echo.

REM Start the backend server
start "ProductiveFire Backend" cmd /k "echo Backend Server Running && node server.js"

echo.
echo ⏰ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Backend started! You can now:
echo   1. Open your browser to http://localhost:5500 (if using Live Server)
echo   2. Or open index.html with any local server
echo   3. Backend API is available at http://localhost:3001
echo.
echo 💡 To start frontend:
echo   - Use VS Code Live Server extension (recommended)
echo   - Or run: python -m http.server 8080
echo   - Or run: npx http-server -p 8080
echo.
echo Press any key to exit...
pause >nul
