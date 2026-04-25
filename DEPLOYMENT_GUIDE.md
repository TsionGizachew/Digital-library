# Yeka Library Deployment Guide

## 🎯 Overview

Your application has:
- ✅ **Real TypeScript Backend** (`src/`) with MongoDB, Socket.IO, JWT, Cloudinary
- ✅ **React Frontend** with TypeScript
- ✅ **Already compiled** backend in `dist/` folder
- ✅ **MongoDB Atlas** connection configured
- ✅ **Socket.IO** for real-time features

## 📦 What You Have

### Backend (Real - Not Mock!)
- **Location**: `src/` (TypeScript source) → compiles to `dist/`
- **Database**: MongoDB Atlas (already configured in `.env`)
- **Real-time**: Socket.IO configured and working
- **Image Upload**: Cloudinary integration
- **Authentication**: JWT with refresh tokens
- **Features**: Books, Users, Bookings, Events, Announcements, Dashboard

### Frontend
- **Location**: `frontend/`
- **Framework**: React + TypeScript
- **Build Output**: `frontend/build/` (static files)

---

## 🚀 Deployment Strategy

### Option 1: Railway (Recommended - Easiest)

#### Step 1: Deploy Backend to Railway

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to [Railway.app](https://railway.app)**
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment Variables** in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   API_VERSION=v1
   MONGODB_URI=mongodb+srv://ashenafidejene75:LaewpbBmdkaFqIqL@cluster0.dolqtm6.mongodb.net/library?retryWrites=true&w=majority
   JWT_ACCESS_SECRET=yeka-library-super-secret-access-token-key-2024
   JWT_REFRESH_SECRET=yeka-library-super-secret-refresh-token-key-2024
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://yourdomain.com
   SOCKET_CORS_ORIGIN=https://yourdomain.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=info
   LOG_FILE=logs/app.log
   ADMIN_EMAIL=admin@yekalibrary.gov.et
   ADMIN_PASSWORD=admin123
   CLOUDINARY_CLOUD_NAME=dtkg4wfr2
   CLOUDINARY_API_KEY=284779213721152
   CLOUDINARY_API_SECRET=uyh6m8MD4KL_WJCayFBE5kX-8no
   ```

   **IMPORTANT**: Replace `https://yourdomain.com` with your actual ET hosting domain!

4. **Railway will automatically**:
   - Detect Node.js
   - Run `npm install && npm run build`
   - Start with `npm start`
   - Give you a URL like `https://your-app.up.railway.app`

#### Step 2: Build & Deploy Frontend to ET Hosting

1. **Update frontend API URL**:
   Edit `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://your-app.up.railway.app/api/v1
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Upload to ET Hosting**:
   - Open cPanel File Manager or use FTP
   - Navigate to `public_html/`
   - Upload ALL files from `frontend/build/` folder
   - Make sure `.htaccess` is uploaded (for React Router)

4. **Verify `.htaccess` exists** in `public_html/`:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

---

### Option 2: Render.com (Alternative)

#### Step 1: Deploy to Render

1. **Push code to GitHub** (same as Railway)

2. **Go to [Render.com](https://render.com)**
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service**:
   - **Name**: yeka-library-backend
   - **Environment**: Node
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables** (same as Railway list above)

5. **Deploy** - Render will build and start your app

#### Step 2: Frontend (same as Railway - upload to ET hosting)

---

## 🔧 Local Testing Before Deployment

### Test Backend Locally

```bash
# Make sure MongoDB Atlas is accessible
npm install
npm run build
npm start
```

Visit `http://localhost:3000/health` - should return:
```json
{
  "success": true,
  "message": "Server is healthy",
  "environment": "development"
}
```

### Test Frontend Locally

```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3001` - should load the app

---

## 🔐 Security Checklist Before Deployment

- [ ] Change `ADMIN_PASSWORD` in production
- [ ] Use strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Update `CORS_ORIGIN` to your actual domain
- [ ] Never commit `.env` file to GitHub (already in `.gitignore`)
- [ ] Use environment variables in Railway/Render dashboard, not hardcoded

---

## 🌐 After Deployment

### Update Backend CORS

Once you know your ET hosting domain (e.g., `https://yekalibrary.et`), update in Railway/Render:

```
CORS_ORIGIN=https://yekalibrary.et,https://www.yekalibrary.et
SOCKET_CORS_ORIGIN=https://yekalibrary.et,https://www.yekalibrary.et
```

### Test the Deployment

1. **Backend Health Check**:
   ```
   https://your-app.up.railway.app/health
   ```

2. **Frontend**:
   ```
   https://yourdomain.com
   ```

3. **Login Test**:
   - Email: `admin@yekalibrary.gov.et`
   - Password: `admin123`

---

## 📊 What's Working (Real Features)

✅ **MongoDB Atlas** - Real database, not mock data  
✅ **Socket.IO** - Real-time notifications  
✅ **JWT Authentication** - Secure login/logout  
✅ **Cloudinary** - Image uploads for book covers  
✅ **Books Management** - Full CRUD operations  
✅ **User Management** - Admin can manage users  
✅ **Borrowing System** - Book checkout/return  
✅ **Events & Announcements** - Real-time updates  
✅ **Dashboard Analytics** - Real data from MongoDB  

---

## 🐛 Troubleshooting

### Backend won't start
- Check Railway/Render logs
- Verify `MONGODB_URI` is correct
- Ensure all required env vars are set

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify CORS settings in backend
- Check browser console for errors

### Socket.IO not connecting
- Verify `SOCKET_CORS_ORIGIN` matches your frontend domain
- Check if WebSocket is blocked by firewall

### Images not uploading
- Verify Cloudinary credentials
- Check file size limits

---

## 📝 Quick Commands Reference

```bash
# Backend
npm install              # Install dependencies
npm run build           # Compile TypeScript
npm start               # Start production server
npm run dev             # Start development server

# Frontend
cd frontend
npm install             # Install dependencies
npm start               # Start development server
npm run build          # Build for production
```

---

## 🎉 You're Ready!

Your app is **production-ready** with:
- Real MongoDB database
- Real-time Socket.IO
- Secure authentication
- Image uploads
- Full library management system

Just deploy the backend to Railway/Render and upload the frontend build to your ET hosting!
