# 🚂 Railway Deployment Guide - Step by Step

## ⚠️ Important: Don't Use .env File in Railway

Railway reads environment variables from its dashboard, NOT from your `.env` file. The error you're seeing is because Railway is trying to parse the `.env` file incorrectly.

---

## 🚀 Step-by-Step Railway Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Yeka Library"

# Add your GitHub repository
git remote add origin YOUR_GITHUB_REPO_URL

# Push to GitHub
git push -u origin main
```

---

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Railway will start building automatically (it will fail first time - that's OK!)

---

### Step 3: Add Environment Variables in Railway Dashboard

Click on your project → **"Variables"** tab → Add these one by one:

#### Required Variables (Copy these exactly)

```
NODE_ENV=production
PORT=3000
API_VERSION=v1
```

#### Database
```
MONGODB_URI=mongodb+srv://ashenafidejene75:LaewpbBmdkaFqIqL@cluster0.dolqtm6.mongodb.net/library?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb://localhost:27017/digital-library-test
```

#### JWT Secrets
```
JWT_ACCESS_SECRET=yeka-library-super-secret-access-token-key-2024-production
JWT_REFRESH_SECRET=yeka-library-super-secret-refresh-token-key-2024-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### CORS (⚠️ UPDATE THIS with your actual domain!)
```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
SOCKET_CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

#### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Logging
```
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

#### Admin Account
```
ADMIN_EMAIL=admin@yekalibrary.gov.et
ADMIN_PASSWORD=ChangeThisPassword123!
```

#### Cloudinary
```
CLOUDINARY_CLOUD_NAME=dtkg4wfr2
CLOUDINARY_API_KEY=284779213721152
CLOUDINARY_API_SECRET=uyh6m8MD4KL_WJCayFBE5kX-8no
```

#### Email (Optional - for password reset)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yekalibrary.gov.et
EMAIL_FROM_NAME=Yeka Digital Library
```

---

### Step 4: Configure Build Settings

1. In Railway dashboard, click **"Settings"** tab
2. Under **"Build"** section:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Under **"Deploy"** section:
   - **Watch Paths**: Leave default (watches all files)

---

### Step 5: Redeploy

1. Click **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for build to complete (2-5 minutes)
4. Check logs for any errors

---

### Step 6: Get Your Railway URL

1. Go to **"Settings"** tab
2. Under **"Domains"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-app.up.railway.app`)

---

### Step 7: Test Backend

Open your Railway URL in browser:
```
https://your-app.up.railway.app/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is healthy",
  "environment": "production",
  "version": "v1"
}
```

---

### Step 8: Update CORS for Your Domain

Once you know your ET hosting domain:

1. Go back to Railway **"Variables"** tab
2. Update these variables:
   ```
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   SOCKET_CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```
3. Railway will automatically redeploy

---

### Step 9: Deploy Frontend

1. Update `frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-app.up.railway.app/api/v1
   ```

2. Build frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Upload `frontend/build/*` to ET hosting `public_html/`

4. Make sure `.htaccess` is in `public_html/`:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

---

## 🐛 Troubleshooting

### Build Fails with "empty key" error
**Solution**: Don't commit `.env` file. Use Railway dashboard variables only.

### "Cannot connect to MongoDB"
**Solution**: Check `MONGODB_URI` is correct in Railway variables.

### CORS errors in browser
**Solution**: Update `CORS_ORIGIN` in Railway to match your frontend domain.

### "Module not found" errors
**Solution**: Make sure `npm install && npm run build` runs successfully.

### Port already in use
**Solution**: Railway automatically assigns `PORT` variable. Don't hardcode port 3000.

---

## 📊 Railway Free Tier Limits

- ✅ 500 hours/month (enough for 24/7 uptime)
- ✅ 512MB RAM
- ✅ 1GB disk space
- ✅ Shared CPU
- ✅ Free SSL certificate
- ✅ Automatic deployments from GitHub

---

## 🔐 Security Checklist

- [ ] Changed `ADMIN_PASSWORD` from default
- [ ] Updated `JWT_ACCESS_SECRET` to strong random string
- [ ] Updated `JWT_REFRESH_SECRET` to strong random string
- [ ] Set `CORS_ORIGIN` to your actual domain only
- [ ] `.env` file is in `.gitignore` (not committed)
- [ ] All sensitive data is in Railway dashboard, not in code

---

## ✅ Success Indicators

- ✅ Railway build completes without errors
- ✅ Health check returns 200 OK
- ✅ Can login with admin credentials
- ✅ Books display correctly
- ✅ Images upload successfully
- ✅ Real-time notifications work

---

## 🎉 You're Live!

Your backend is now deployed on Railway with:
- ✅ MongoDB Atlas database
- ✅ Socket.IO real-time features
- ✅ JWT authentication
- ✅ Cloudinary image uploads
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push

**Next**: Deploy frontend to ET hosting and you're done! 🚀
