# BDPortFlow - Complete MERN Stack Implementation

![BDPortFlow](https://img.shields.io/badge/BDPortFlow-MERN%20Stack-success)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)
![Express](https://img.shields.io/badge/Express-4.18+-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

> **A complete Terminal Operating System for Chittagong Port built with MongoDB, Express.js, React, and Node.js**

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB v6+ ([Download](https://www.mongodb.com/try/download/community))
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd bdportflow

# 2. Install all dependencies (frontend + backend)
npm run install:all

# 3. Seed the database with demo data
npm run seed

# 4. Start both frontend and backend servers
npm run start:all
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Login Credentials (Demo)

```
Role            Email                           Password
────────────────────────────────────────────────────────
Admin           admin@bdport.gov.bd            admin123
Operator        operator@bdport.gov.bd         operator123
Berth Planner   berth@bdport.gov.bd            berth123
Customs         customs@bdport.gov.bd          customs123
Finance         finance@bdport.gov.bd          finance123
Truck Driver    driver@bdport.gov.bd           driver123
```

---

## 📁 Project Structure

```
bdportflow/
├── api/                        # API client configuration
│   └── client.ts              # Axios instance with auth interceptors
│
├── components/                 # React components
│   ├── Login.tsx              # Login page with real authentication
│   ├── Dashboard.tsx          # Main dashboard
│   ├── AdminPanel.tsx         # User management
│   ├── BerthPlanner.tsx       # Berth scheduling
│   ├── ContainerStacking.tsx  # Container yard management
│   ├── GateOperations.tsx     # Gate entry/exit
│   ├── ReeferMonitoring.tsx   # Temperature monitoring
│   ├── CustomClearance.tsx    # Customs processing
│   ├── BillingTariff.tsx      # Invoice management
│   └── ... (more components)
│
├── context/                    # React Context
│   └── AppContext.tsx         # Global state with API integration
│
├── server/                     # Backend (Node.js + Express)
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Vessel.js
│   │   ├── Container.js
│   │   ├── Reefer.js
│   │   ├── Gate.js
│   │   ├── Truck.js
│   │   ├── Customs.js
│   │   ├── Rail.js
│   │   └── Billing.js
│   │
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── vesselController.js
│   │   └── ... (more controllers)
│   │
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── vessels.js
│   │   └── ... (more routes)
│   │
│   ├── middleware/            # Custom middleware
│   │   └── auth.js           # JWT authentication
│   │
│   ├── scripts/               # Utility scripts
│   │   └── seed.js           # Database seeding
│   │
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js             # Express server entry point
│
├── styles/                     # CSS styles
│   └── globals.css
│
├── .env                       # Frontend environment variables
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
│
├── SETUP.md                   # Detailed setup guide
├── API_DOCUMENTATION.md       # Complete API reference
├── DATABASE_SCHEMA.md         # Database schema documentation
├── PROJECT_OVERVIEW.md        # Architecture overview
└── README_MERN.md            # This file
```

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control (6 roles)
- ✅ Protected API routes
- ✅ Token auto-refresh
- ✅ Secure password storage

### 👥 User Management (Admin Only)
- ✅ Create, read, update, delete users
- ✅ Activate/deactivate accounts
- ✅ Role assignment
- ✅ User search and filter
- ✅ Last login tracking

### 🚢 Vessel Management
- ✅ Complete vessel information
- ✅ Berth assignment
- ✅ ETA/ETD tracking
- ✅ Loading progress monitoring
- ✅ Container capacity tracking

### 📦 Container Operations
- ✅ Container tracking
- ✅ Location management (Block/Bay/Row/Tier)
- ✅ Status updates
- ✅ Weight and cargo information
- ✅ Hazmat identification
- ✅ Customs status

### 🌡️ Reefer Monitoring
- ✅ Real-time temperature tracking
- ✅ Power status monitoring
- ✅ Alert management
- ✅ Temperature history
- ✅ Maintenance scheduling

### 🚪 Gate Operations
- ✅ Multi-gate management
- ✅ Entry/exit transaction processing
- ✅ Gate pass generation
- ✅ Queue tracking
- ✅ Daily statistics

### 🚚 Truck Appointments
- ✅ Time slot booking
- ✅ QR code generation
- ✅ Check-in/check-out tracking
- ✅ Appointment management
- ✅ Driver information

### 📋 Customs Clearance
- ✅ Application submission
- ✅ Document management
- ✅ Approval workflow
- ✅ Status tracking
- ✅ Duty/tax calculation

### 🚂 Rail Coordination
- ✅ Train schedule management
- ✅ Container loading
- ✅ Capacity tracking
- ✅ Route management

### 💰 Billing & Invoicing
- ✅ Invoice generation
- ✅ Service-based billing
- ✅ Payment tracking
- ✅ Revenue reports
- ✅ Multi-currency support

### 📊 Dashboard & Analytics
- ✅ Real-time statistics
- ✅ KPI monitoring
- ✅ Visual analytics
- ✅ Activity feed
- ✅ Alert notifications

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI library |
| TypeScript | 5.3 | Type safety |
| Vite | 5.0 | Build tool |
| Tailwind CSS | 4.0 | Styling |
| Axios | 1.6 | HTTP client |
| Lucide React | 0.309 | Icons |
| Context API | Built-in | State management |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.18 | Web framework |
| MongoDB | 6.0+ | Database |
| Mongoose | 8.0 | ODM |
| JWT | 9.0 | Authentication |
| Bcrypt | 2.4 | Password hashing |

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          # Login
POST   /api/auth/register       # Register
GET    /api/auth/me             # Get current user
POST   /api/auth/logout         # Logout
PUT    /api/auth/updatepassword # Update password
```

### Resources (CRUD)
```
GET    /api/vessels             # List vessels
POST   /api/vessels             # Create vessel
GET    /api/vessels/:id         # Get vessel
PUT    /api/vessels/:id         # Update vessel
DELETE /api/vessels/:id         # Delete vessel

# Similar CRUD endpoints for:
# - /api/containers
# - /api/gates
# - /api/trucks
# - /api/customs
# - /api/rails
# - /api/billing
# - /api/reefers
```

### Specialized Endpoints
```
GET    /api/dashboard/stats     # Dashboard statistics
GET    /api/berths              # Berth status
POST   /api/gates/:id/transaction  # Process gate transaction
PATCH  /api/customs/:id/approve    # Approve customs clearance
PATCH  /api/trucks/:id/checkin     # Truck check-in
```

**Full API documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🗄️ Database Schema

### Collections
1. **users** - User accounts (authentication & roles)
2. **vessels** - Ship/vessel information
3. **containers** - Container inventory
4. **reefers** - Refrigerated container monitoring
5. **gates** - Gate operations & transactions
6. **trucks** - Truck appointments
7. **customs** - Customs clearance applications
8. **rails** - Rail transportation schedules
9. **billings** - Invoices & payments

**Full schema documentation:** See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## 🎨 UI Features

### Design System
- ⚫ Dark mode theme (slate color palette)
- 🟢 Neon accents (emerald, orange, blue)
- ✨ Glass morphism effects
- 🎯 Mission-control aesthetic
- 📱 Fully responsive (mobile, tablet, desktop)

### User Experience
- ⌨️ Keyboard shortcuts
- 🔍 Global search
- 🔔 Real-time notifications
- 📊 Interactive charts
- 🎨 Role-based UI customization
- 🌐 Mobile-optimized interface

---

## 🔒 Security

### Authentication
- JWT tokens with 7-day expiration
- Secure HTTP-only cookie storage (optional)
- Automatic token refresh
- Password strength validation

### Authorization
- Role-based access control (RBAC)
- Route-level protection
- API endpoint restrictions
- Data isolation per user role

### Data Protection
- Bcrypt password hashing (10 salt rounds)
- MongoDB injection prevention
- Input validation and sanitization
- CORS configuration
- Environment variable protection

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | Complete installation and setup guide |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Full API reference with examples |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Database structure and relationships |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | System architecture and design |

---

## 🚦 Running the Application

### Development Mode

**Option 1: Run separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**Option 2: Run concurrently**
```bash
npm run start:all
```

### Production Build

```bash
# Build frontend
npm run build

# Start backend in production
cd server
NODE_ENV=production node server.js
```

---

## 🧪 Testing

### API Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bdport.gov.bd","password":"admin123"}'

# Get vessels (replace TOKEN)
curl http://localhost:5000/api/vessels \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import API collection
2. Set environment: `http://localhost:5000/api`
3. Login to get JWT token
4. Use token in Authorization header

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Start MongoDB
sudo systemctl start mongod    # Linux
brew services start mongodb     # Mac
```

**Port Already in Use**
```bash
# Change PORT in server/.env
PORT=5001
```

**CORS Errors**
- Verify `CLIENT_URL` in `server/.env` matches frontend URL
- Default: `http://localhost:5173`

**Authentication Errors**
- Ensure JWT_SECRET is consistent
- Clear localStorage and re-login
- Check token expiration

---

## 📊 Project Metrics

- **Total Components:** 40+
- **API Endpoints:** 70+
- **Database Collections:** 9
- **User Roles:** 6
- **System Modules:** 12
- **Lines of Code:** ~15,000+

---

## 🎓 Educational Purpose

This project is developed as part of **Software Engineering coursework** to demonstrate:
- Full-stack web development
- RESTful API design
- Database modeling
- Authentication & authorization
- Role-based access control
- Professional documentation

---

## 🤝 Contributing

This is an academic project. For improvements or bug fixes:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create pull request

---

## 📄 License

This project is for educational purposes only as part of academic coursework.

---

## 🆘 Support

For issues or questions:
1. Check [SETUP.md](./SETUP.md) for installation help
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API usage
3. Examine [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data structures
4. Contact development team

---

## 🙏 Acknowledgments

- Chittagong Port Authority (inspiration)
- Modern port terminal systems
- MERN stack community
- Open-source contributors

---

**Built with ❤️ for Software Engineering Project**

**Last Updated:** March 9, 2024  
**Version:** 1.0.0 (Complete MERN Stack)
