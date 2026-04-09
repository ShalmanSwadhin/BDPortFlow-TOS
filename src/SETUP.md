# BDPortFlow - MERN Stack Setup Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (cloud database) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** (for version control)

### Check Installation

```bash
node --version    # Should be v18+
npm --version     # Should be 8+
mongo --version   # Should be v6+
```

## 📁 Project Structure

```
bdportflow/
├── client/                  # React Frontend (Already exists)
│   ├── components/         # React components
│   ├── context/           # Context providers
│   ├── api/               # API client
│   ├── styles/            # CSS styles
│   └── App.tsx            # Main app component
│
├── server/                 # Node.js Backend (New)
│   ├── models/            # Mongoose models
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & error handling
│   ├── config/            # Database config
│   ├── scripts/           # Utility scripts
│   ├── .env               # Environment variables
│   └── server.js          # Express server
│
└── README.md              # Project documentation
```

## 🚀 Installation

### Step 1: Clone the Repository (if not done)

```bash
git clone <repository-url>
cd bdportflow
```

### Step 2: Install Frontend Dependencies

```bash
# From project root
npm install
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to server directory
cd server
npm install
cd ..
```

## ⚙️ Environment Configuration

### Frontend Environment (.env)

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment (server/.env)

The `server/.env` file should already exist. Verify it contains:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/bdportflow
JWT_SECRET=bdportflow_secret_key_2024_change_in_production
JWT_EXPIRE=7d
```

#### Using MongoDB Atlas (Cloud Database)

If you want to use MongoDB Atlas instead of local MongoDB:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `server/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bdportflow?retryWrites=true&w=majority
```

## 🗄️ Database Seeding

Seed the database with initial demo data:

```bash
cd server
npm run seed
```

This will create demo users with the following credentials:

```
Admin:      admin@bdport.gov.bd / admin123
Operator:   operator@bdport.gov.bd / operator123
Berth:      berth@bdport.gov.bd / berth123
Customs:    customs@bdport.gov.bd / customs123
Finance:    finance@bdport.gov.bd / finance123
Truck:      driver@bdport.gov.bd / driver123
```

## ▶️ Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
# From project root
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Option 2: Run Both Concurrently

Add this to root `package.json`:

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix server\" \"vite\"",
  "server": "npm run dev --prefix server",
  "client": "vite"
}
```

Then install concurrently:
```bash
npm install -D concurrently
```

And run:
```bash
npm run dev
```

## 🔑 Using the Application

1. Open browser and navigate to `http://localhost:5173`
2. Click "Access Portal" from the public dashboard
3. Login with any of the demo credentials above
4. Explore the different modules based on your role

### Role-Based Access

- **Admin**: Full access to all modules + user management
- **Operator**: Port operations, containers, vessels
- **Berth**: Berth planning and vessel scheduling
- **Customs**: Customs clearance management
- **Finance**: Billing and invoicing
- **Truck**: Truck appointment booking

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/api/auth/login`
```json
{
  "email": "admin@bdport.gov.bd",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@bdport.gov.bd",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### GET `/api/auth/me`
Headers: `Authorization: Bearer <token>`

### Main Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/vessels` | GET | Get all vessels | Yes |
| `/api/vessels/:id` | GET | Get single vessel | Yes |
| `/api/vessels` | POST | Create vessel | Yes (Admin/Operator) |
| `/api/containers` | GET | Get all containers | Yes |
| `/api/containers/:id` | GET | Get single container | Yes |
| `/api/gates` | GET | Get all gates | Yes |
| `/api/trucks` | GET | Get truck appointments | Yes |
| `/api/customs` | GET | Get customs clearances | Yes |
| `/api/billing` | GET | Get invoices | Yes |
| `/api/dashboard/stats` | GET | Get dashboard stats | Yes |

For complete API documentation, see [API.md](./API.md)

## 🧪 Testing

### Test Backend API with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bdport.gov.bd","password":"admin123"}'

# Get vessels (replace TOKEN)
curl http://localhost:5000/api/vessels \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test with Postman

1. Import the API collection
2. Set base URL: `http://localhost:5000/api`
3. Login to get token
4. Add token to Authorization header for protected routes

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoDB Connection Error`

**Solutions:**
- Ensure MongoDB is running: `sudo systemctl start mongod` (Linux) or check MongoDB Compass
- Verify connection string in `server/.env`
- Check MongoDB is listening on port 27017

### Port Already in Use

**Problem:** `Port 5000 is already in use`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000    # Mac/Linux
netstat -ano | findstr :5000   # Windows

# Kill the process or change PORT in server/.env
```

### CORS Errors

**Problem:** Cross-Origin Request Blocked

**Solution:**
- Verify `CLIENT_URL` in `server/.env` matches your frontend URL
- Check CORS configuration in `server/server.js`

### Authentication Errors

**Problem:** Token expired or invalid

**Solution:**
- Logout and login again
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET is consistent

### Module Not Found

**Problem:** Cannot find module errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# In server directory
cd server
rm -rf node_modules package-lock.json
npm install
```

## 📦 Production Deployment

### Build Frontend

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Environment Variables for Production

Update `server/.env`:
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_random_secret_key
JWT_EXPIRE=7d
```

### Start Production Server

```bash
cd server
NODE_ENV=production node server.js
```

## 🆘 Support

For issues and questions:
- Check [Troubleshooting](#troubleshooting) section
- Review error logs in terminal
- Contact development team

## 📄 License

This project is for educational purposes as part of Software Engineering coursework.
