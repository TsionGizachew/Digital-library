@echo off
echo ========================================
echo Yeka Library - Deployment Preparation
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    exit /b 1
)
echo [OK] .env file found

REM Check MongoDB URI
findstr /C:"MONGODB_URI=mongodb+srv://" .env >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB Atlas URI configured
) else (
    echo [WARNING] MongoDB URI not configured
)

REM Check Cloudinary
findstr /C:"CLOUDINARY_CLOUD_NAME=" .env >nul
if %errorlevel% equ 0 (
    echo [OK] Cloudinary configured
) else (
    echo [WARNING] Cloudinary not configured
)

echo.
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend npm install failed
    exit /b 1
)

echo.
echo Building backend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed
    exit /b 1
)
echo [OK] Backend build successful

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend npm install failed
    exit /b 1
)

echo.
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    exit /b 1
)
echo [OK] Frontend build successful

cd ..

echo.
echo ========================================
echo [SUCCESS] Deployment preparation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Push code to GitHub
echo 2. Deploy backend to Railway/Render
echo 3. Update frontend/.env with backend URL
echo 4. Rebuild frontend: cd frontend ^&^& npm run build
echo 5. Upload frontend/build/* to ET hosting public_html/
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
