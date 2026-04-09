# 🚀 BDPortFlow - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Prerequisites Check

```bash
node --version    # Must be v18+
npm --version     # Must be v8+
mongo --version   # Must be v6+ (or use MongoDB Atlas)
```

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

**OR** use the shortcut:

```bash
npm run install:all
```

---

## 🗄️ Database Setup

### Option A: Local MongoDB

1. **Start MongoDB:**
```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

2. **Seed Database:**
```bash
npm run seed
```

### Option B: MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bdportflow
```
4. Run seed:
```bash
npm run seed
```

---

## ▶️ Start the Application

### Run Both Frontend & Backend:

```bash
npm run start:all
```

### OR Run Separately:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 🌐 Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

---

## 🔑 Login Credentials

Use any of these accounts:

```
┌─────────────────┬─────────────────────────────┬──────────────┐
│ Role            │ Email                       │ Password     │
├─────────────────┼─────────────────────────────┼──────────────┤
│ Admin           │ admin@bdport.gov.bd         │ admin123     │
│ Port Operator   │ operator@bdport.gov.bd      │ operator123  │
│ Berth Planner   │ berth@bdport.gov.bd         │ berth123     │
│ Customs Officer │ customs@bdport.gov.bd       │ customs123   │
│ Finance Manager │ finance@bdport.gov.bd       │ finance123   │
│ Truck Driver    │ driver@bdport.gov.bd        │ driver123    │
└─────────────────┴─────────────────────────────┴──────────────┘
```

---

## 🎯 Quick Test

1. **Open browser:** http://localhost:5173
2. **Click:** "Access Portal"
3. **Login as Admin:**
   - Email: `admin@bdport.gov.bd`
   - Password: `admin123`
4. **Explore modules:**
   - Dashboard
   - Admin Panel (user management)
   - Berth Planner
   - Container Tracking
   - And more...

---

## 🧪 Test API Endpoints

### Using cURL:

```bash
# 1. Health Check
curl http://localhost:5000/api/health

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bdport.gov.bd","password":"admin123"}'

# Copy the token from response, then:

# 3. Get Vessels
curl http://localhost:5000/api/vessels \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Browser:

Visit: http://localhost:5000/api/health

Should see:
```json
{
  "status": "OK",
  "message": "BDPortFlow API Server Running",
  "timestamp": "2024-03-09T10:30:00.000Z"
}
```

---

## 📚 Available Commands

```bash
# Development
npm run dev              # Start frontend (Vite dev server)
npm run server           # Start backend (Nodemon)
npm run start:all        # Start both concurrently

# Database
npm run seed             # Seed demo data

# Installation
npm install              # Install frontend dependencies
npm run install:all      # Install all (frontend + backend)

# Build
npm run build            # Build frontend for production
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Fix:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod    # Linux
brew services list              # macOS

# Start MongoDB
sudo systemctl start mongod     # Linux
brew services start mongodb     # macOS
```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Fix:** Change port in `server/.env`:
```env
PORT=5001
```

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Fix:** Verify `CLIENT_URL` in `server/.env`:
```env
CLIENT_URL=http://localhost:5173
```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Fix:**
```bash
cd server
npm install
```

### Authentication Failed

**Error:** `Invalid credentials`

**Fix:**
1. Ensure database is seeded: `npm run seed`
2. Use correct email/password from table above
3. Check backend is running on port 5000

---

## 📖 Need More Help?

- **Full Setup Guide:** [SETUP.md](./SETUP.md)
- **API Reference:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Database Schema:** [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Architecture:** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

---

## ✅ Verification Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB v6+ installed (or Atlas configured)
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login with demo credentials
- [ ] API health check returns OK

---

## 🎉 You're All Set!

The complete MERN stack application is now running!

**What to try:**
1. Login as different roles to see role-based access
2. Create a new vessel in Berth Planner
3. Track containers in Container Stacking
4. Book a truck appointment
5. Process customs clearances
6. Generate invoices in Billing

**Enjoy exploring BDPortFlow!** 🚢⚓

---

**Need help?** Check the troubleshooting section above or review the detailed documentation files.
