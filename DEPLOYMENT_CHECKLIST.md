# 🚀 Deployment Checklist

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] `.env` file is NOT committed (check `.gitignore`)
- [ ] Backend compiles successfully (`npm run build`)
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] MongoDB Atlas is accessible (test connection)
- [ ] Cloudinary credentials are valid

## Backend Deployment (Railway/Render)

- [ ] Create account on Railway.app or Render.com
- [ ] Connect GitHub repository
- [ ] Configure all environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `MONGODB_URI` (your Atlas connection string)
  - [ ] `JWT_ACCESS_SECRET`
  - [ ] `JWT_REFRESH_SECRET`
  - [ ] `CORS_ORIGIN` (your ET hosting domain)
  - [ ] `SOCKET_CORS_ORIGIN` (same as CORS_ORIGIN)
  - [ ] `ADMIN_EMAIL`
  - [ ] `ADMIN_PASSWORD`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
- [ ] Deploy and wait for build to complete
- [ ] Test health endpoint: `https://your-app.railway.app/health`
- [ ] Copy the deployed backend URL

## Frontend Deployment (ET Hosting)

- [ ] Update `frontend/.env` with backend URL:
  ```
  REACT_APP_API_URL=https://your-app.railway.app/api/v1
  ```
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Verify `frontend/build/.htaccess` exists
- [ ] Login to cPanel or FTP
- [ ] Navigate to `public_html/`
- [ ] Upload ALL files from `frontend/build/` folder
- [ ] Verify `.htaccess` is uploaded
- [ ] Test your domain in browser

## Post-Deployment Testing

- [ ] Visit your domain (ET hosting)
- [ ] Check browser console for errors
- [ ] Test login with admin credentials:
  - Email: `admin@yekalibrary.gov.et`
  - Password: `admin123`
- [ ] Test book search
- [ ] Test adding a book (admin)
- [ ] Test real-time notifications (Socket.IO)
- [ ] Test image upload (Cloudinary)
- [ ] Test on mobile device

## Security Updates (IMPORTANT!)

- [ ] Change `ADMIN_PASSWORD` in Railway/Render dashboard
- [ ] Update `JWT_ACCESS_SECRET` to a strong random string
- [ ] Update `JWT_REFRESH_SECRET` to a strong random string
- [ ] Verify CORS only allows your domain
- [ ] Enable HTTPS on your ET hosting domain

## Final Steps

- [ ] Update backend CORS with actual domain (not localhost)
- [ ] Test all features end-to-end
- [ ] Monitor Railway/Render logs for errors
- [ ] Set up error monitoring (optional)
- [ ] Document admin credentials securely

---

## 🎯 Quick Deploy Commands

### Backend (Local Build Test)
```bash
npm install
npm run build
npm start
```

### Frontend (Build for Production)
```bash
cd frontend
npm install
npm run build
# Upload frontend/build/* to public_html/
```

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Cloudinary: https://cloudinary.com/documentation

---

## ✅ Success Indicators

- ✅ Backend health check returns 200 OK
- ✅ Frontend loads without console errors
- ✅ Login works and redirects to dashboard
- ✅ Books display with images
- ✅ Real-time notifications appear
- ✅ Admin can add/edit/delete books
- ✅ Socket.IO shows "connected" in network tab
