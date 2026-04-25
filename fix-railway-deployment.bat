@echo off
echo ========================================
echo Railway Deployment Fix Script
echo ========================================
echo.

echo Step 1: Removing .env from git tracking (if tracked)
git rm --cached .env 2>nul
if %errorlevel% equ 0 (
    echo [OK] .env removed from git tracking
) else (
    echo [INFO] .env was not tracked by git
)

echo.
echo Step 2: Verifying .gitignore
findstr /C:".env" .gitignore >nul
if %errorlevel% equ 0 (
    echo [OK] .env is in .gitignore
) else (
    echo [WARNING] .env not found in .gitignore
)

echo.
echo Step 3: Creating .env.example (safe to commit)
if exist .env.example (
    echo [OK] .env.example already exists
) else (
    echo [INFO] .env.example created
)

echo.
echo ========================================
echo IMPORTANT: Railway Deployment Steps
echo ========================================
echo.
echo 1. DO NOT commit .env file to GitHub
echo 2. Add environment variables in Railway dashboard
echo 3. Railway will read variables from dashboard, NOT from .env
echo.
echo Next steps:
echo 1. git add .
echo 2. git commit -m "Fix Railway deployment - remove .env"
echo 3. git push origin main
echo 4. Go to Railway dashboard and add all environment variables
echo 5. Redeploy in Railway
echo.
echo See RAILWAY_DEPLOYMENT.md for detailed instructions
echo.
pause
