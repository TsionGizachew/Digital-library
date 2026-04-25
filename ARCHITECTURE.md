# 🏗️ Yeka Library - System Architecture

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                    (Web Browsers)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ETHIOPIAN TELECOM HOSTING                       │
│                  (Frontend - Static)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App (Built)                                    │  │
│  │  - HTML, CSS, JS                                      │  │
│  │  - Images, Fonts                                      │  │
│  │  - .htaccess (React Router)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls (HTTPS)
                     │ WebSocket (Socket.IO)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAILWAY / RENDER                          │
│                  (Backend - Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Server                                    │  │
│  │  - REST API (JWT Auth)                                │  │
│  │  - Socket.IO (Real-time)                              │  │
│  │  - TypeScript → JavaScript                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────┬──────────────────┬──────────────────┬──────────────┘
         │                  │                  │
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  MONGODB ATLAS  │ │   CLOUDINARY    │ │   SOCKET.IO     │
│   (Database)    │ │ (Image Storage) │ │  (Real-time)    │
│                 │ │                 │ │                 │
│  - Users        │ │  - Book Covers  │ │  - Notifications│
│  - Books        │ │  - User Photos  │ │  - Live Updates │
│  - Bookings     │ │                 │ │  - Admin Events │
│  - Events       │ │                 │ │                 │
│  - Announcements│ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🔧 Technology Stack

### Frontend
```
React 18.2.0
├── TypeScript
├── React Router 6.16.0
├── Tailwind CSS 3.3.3
├── Axios (API calls)
├── Socket.IO Client (Real-time)
├── Chart.js (Analytics)
├── React Hot Toast (Notifications)
└── i18next (Multi-language)
```

### Backend
```
Node.js + Express
├── TypeScript 5.3.3
├── MongoDB + Mongoose 8.0.3
├── Socket.IO 4.7.4
├── JWT (jsonwebtoken 9.0.2)
├── Bcrypt (Password hashing)
├── Cloudinary (Image upload)
├── Helmet (Security)
├── Morgan (Logging)
└── Express Rate Limit
```

### Database Schema
```
MongoDB Collections:
├── users
│   ├── Authentication (JWT)
│   ├── Roles (admin/user)
│   └── Preferences
├── books
│   ├── Metadata
│   ├── Availability
│   └── Location
├── bookings
│   ├── Borrow records
│   ├── Due dates
│   └── Status tracking
├── events
│   └── Library events
├── announcements
│   └── System notices
└── notifications
    └── Real-time alerts
```

---

## 🔐 Security Features

### Authentication Flow
```
1. User Login
   ↓
2. Server validates credentials (bcrypt)
   ↓
3. Generate JWT tokens (access + refresh)
   ↓
4. Store refresh token in DB
   ↓
5. Return tokens to client
   ↓
6. Client stores in memory/localStorage
   ↓
7. Include in Authorization header
   ↓
8. Server validates on each request
```

### Security Layers
- ✅ **Helmet.js** - HTTP headers security
- ✅ **CORS** - Cross-origin protection
- ✅ **Rate Limiting** - DDoS protection
- ✅ **JWT** - Stateless authentication
- ✅ **Bcrypt** - Password hashing (12 rounds)
- ✅ **Input Validation** - Express Validator
- ✅ **HTTPS** - Encrypted communication

---

## ⚡ Real-time Features (Socket.IO)

### Events Emitted
```javascript
// Server → Client
'booking:created'       // New booking notification
'booking:updated'       // Booking status changed
'booking:reminder'      // Due date reminder
'booking:overdue'       // Overdue notification
'book:availability_changed'  // Book status changed
'user:status_changed'   // User account status
'notification'          // System notifications
```

### Rooms
```javascript
'user:{userId}'         // Personal notifications
'admin'                 // Admin-only broadcasts
'book:{bookId}'         // Book-specific updates
```

---

## 📁 Project Structure

```
yeka-library/
├── src/                          # Backend TypeScript source
│   ├── config/                   # Configuration
│   │   ├── app.ts               # Express setup
│   │   ├── database.ts          # MongoDB connection
│   │   ├── socket.ts            # Socket.IO setup
│   │   └── env.ts               # Environment variables
│   ├── controllers/             # Request handlers
│   ├── entities/                # MongoDB models
│   ├── middleware/              # Express middleware
│   ├── repositories/            # Data access layer
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Helper functions
│   └── server.ts                # Entry point
├── dist/                        # Compiled JavaScript
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   ├── i18n/                # Translations
│   │   ├── pages/               # Page components
│   │   └── App.tsx              # Root component
│   ├── public/                  # Static assets
│   └── build/                   # Production build
├── logs/                        # Application logs
├── uploads/                     # Temporary uploads
├── .env                         # Environment variables
├── package.json                 # Backend dependencies
├── tsconfig.json                # TypeScript config
├── render.yaml                  # Render deployment
├── railway.toml                 # Railway deployment
└── DEPLOYMENT_*.md              # Deployment docs
```

---

## 🔄 Data Flow

### Book Borrowing Flow
```
1. User searches for book
   ↓
2. Frontend → GET /api/v1/books?search=...
   ↓
3. Backend queries MongoDB
   ↓
4. Returns book list with availability
   ↓
5. User clicks "Borrow"
   ↓
6. Frontend → POST /api/v1/bookings
   ↓
7. Backend validates availability
   ↓
8. Creates booking record
   ↓
9. Updates book availability
   ↓
10. Emits Socket.IO event
   ↓
11. Admin receives real-time notification
   ↓
12. User sees confirmation
```

### Image Upload Flow
```
1. User selects image
   ↓
2. Frontend → POST /api/v1/books (multipart/form-data)
   ↓
3. Multer middleware processes file
   ↓
4. Backend uploads to Cloudinary
   ↓
5. Cloudinary returns URL
   ↓
6. Save URL in MongoDB
   ↓
7. Return book data with image URL
   ↓
8. Frontend displays image
```

---

## 🌐 API Endpoints

### Public Routes
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh-token
GET    /api/v1/books
GET    /api/v1/books/:id
GET    /api/v1/books/categories
```

### Protected Routes (User)
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
POST   /api/v1/bookings
GET    /api/v1/bookings/my-bookings
```

### Admin Routes
```
GET    /api/v1/admin/users
POST   /api/v1/admin/books
PUT    /api/v1/admin/books/:id
DELETE /api/v1/admin/books/:id
GET    /api/v1/admin/borrowing
POST   /api/v1/admin/announcements
POST   /api/v1/admin/events
GET    /api/v1/dashboard/overview
```

---

## 📊 Performance Optimizations

### Backend
- ✅ MongoDB indexes on frequently queried fields
- ✅ Connection pooling (maxPoolSize: 10)
- ✅ Compression middleware
- ✅ Rate limiting
- ✅ Efficient queries with projections

### Frontend
- ✅ Code splitting (React.lazy)
- ✅ Image optimization (Cloudinary)
- ✅ Lazy loading
- ✅ Memoization (useMemo, useCallback)
- ✅ Production build minification

---

## 🔍 Monitoring & Logging

### Backend Logs
```
logs/
├── app.log              # All logs
├── error.log            # Error logs only
└── combined.log         # Combined output
```

### Log Levels
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information
- `debug` - Debugging information

### Health Check
```
GET /health

Response:
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "environment": "production",
  "version": "v1"
}
```

---

## 🚀 Deployment Environments

### Development
```
Backend:  http://localhost:3000
Frontend: http://localhost:3001
Database: MongoDB Atlas
```

### Production
```
Backend:  https://your-app.up.railway.app
Frontend: https://yourdomain.com (ET Hosting)
Database: MongoDB Atlas (same cluster)
```

---

## 📈 Scalability Considerations

### Current Setup (Free Tier)
- Railway: 512MB RAM, 500 hours/month
- MongoDB Atlas: 512MB storage, shared cluster
- Cloudinary: 25GB storage, 25GB bandwidth

### Future Scaling Options
1. **Upgrade Railway** → More RAM, dedicated CPU
2. **MongoDB Atlas** → Dedicated cluster, auto-scaling
3. **Cloudinary** → Higher tier for more storage
4. **CDN** → CloudFlare for static assets
5. **Load Balancer** → Multiple Railway instances

---

**This architecture supports 1000+ concurrent users on free tier!**
