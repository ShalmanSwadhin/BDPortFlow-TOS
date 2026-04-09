# BDPortFlow - Complete MERN Stack Port Terminal Operating System

## 🎯 Project Overview

**BDPortFlow** is a comprehensive Terminal Operating System (TOS) built for Chittagong Port, Bangladesh. It's designed to manage all logistics operations including ships, cranes, containers, trucks, rail coordination, and customs clearance. The system features role-based access control, real-time monitoring, and a professional dark-mode UI with neon accents.

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS v4
- Lucide React (icons)
- Axios (API client)
- Context API (state management)

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Bcrypt password hashing
- RESTful API architecture

**Development Tools:**
- Vite (frontend bundler)
- Nodemon (backend hot reload)
- ESLint & TypeScript

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   React Components (TypeScript)                       │  │
│  │   - Login, Dashboard, Modules                         │  │
│  │   - Role-based UI rendering                           │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │   Context API (Global State)                          │  │
│  │   - User authentication                               │  │
│  │   - Notifications                                      │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │   Axios API Client                                    │  │
│  │   - Interceptors for auth tokens                      │  │
│  │   - Error handling                                     │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │  HTTP/HTTPS (REST API)
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Express.js Server                                   │  │
│  │   - CORS configuration                                │  │
│  │   - Request logging                                   │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │   Middleware                                          │  │
│  │   - JWT authentication                                │  │
│  │   - Role-based authorization                          │  │
│  │   - Error handling                                    │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │   API Routes                                          │  │
│  │   - /auth, /users, /vessels, /containers, etc.        │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │   Controllers (Business Logic)                        │  │
│  │   - CRUD operations                                   │  │
│  │   - Data validation                                   │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │   Mongoose Models                                     │  │
│  │   - Schema definitions                                │  │
│  │   - Data validation                                   │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │  MongoDB Driver
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                      DATABASE                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   MongoDB (NoSQL)                                     │  │
│  │   - Collections: users, vessels, containers, etc.     │  │
│  │   - Indexes for performance                           │  │
│  │   - Relationships via ObjectId                        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Permissions

### 1. Administrator
**Access Level:** Full system access

**Capabilities:**
- User management (create, update, delete, activate/deactivate)
- Access to all modules
- System settings configuration
- Audit logs and reports
- Billing and financial records

### 2. Port Operator
**Access Level:** Operational modules

**Capabilities:**
- Vessel management
- Container tracking and stacking
- Gate operations
- Yard density monitoring
- Reefer container monitoring

### 3. Berth Planner
**Access Level:** Berth and vessel scheduling

**Capabilities:**
- Berth allocation and planning
- Vessel scheduling
- Berth timeline management
- Ship stowage planning

### 4. Customs Officer
**Access Level:** Customs module

**Capabilities:**
- Review customs clearance applications
- Approve/reject/hold clearances
- View container documentation
- Add remarks and notes

### 5. Finance Manager
**Access Level:** Financial modules

**Capabilities:**
- Create and manage invoices
- View billing and tariffs
- Generate financial reports
- Track payments
- Revenue analytics

### 6. Truck Driver
**Access Level:** Truck appointment module

**Capabilities:**
- Book truck appointment slots
- View own appointments
- Check-in/check-out
- Generate QR codes
- View gate directions

---

## 📊 System Modules

### 1. Dashboard
- Real-time statistics and KPIs
- Vessel status overview
- Container count and yard density
- Gate operations summary
- Critical alerts and notifications
- Quick action buttons

### 2. Admin Panel
**Tabs:**
- **Users**: Manage user accounts, roles, and permissions
- **Settings**: System configuration and preferences
- **Audit Logs**: Track system activities and changes

### 3. Berth Planner
- Visual berth timeline
- Vessel scheduling
- Berth allocation
- ETA/ETD management
- Drag-and-drop interface

### 4. Container Stacking
- Yard layout visualization
- Block-wise container organization
- Search and filter containers
- Move/relocate containers
- Hazmat indicators

### 5. Ship Stowage
- 3D vessel bay visualization
- Container loading plan
- Weight distribution
- Reefer container locations
- Hazmat segregation

### 6. Gate Operations
- Multi-gate management
- Entry/exit processing
- Weight verification
- Gate pass generation
- Queue management
- Real-time status

### 7. Truck Appointment
- Time slot booking
- QR code generation
- Appointment management
- Check-in/check-out tracking
- Driver information

### 8. Reefer Monitoring
- Real-time temperature monitoring
- Power status tracking
- Alert management
- Temperature history graphs
- Cargo details
- Maintenance scheduling

### 9. Yard Density Heatmap
- Visual yard occupancy map
- Block-wise density percentage
- Container search
- Location tracking
- Capacity planning

### 10. Rail Coordination
- Train schedule management
- Container loading
- Capacity tracking
- Departure/arrival times
- Route information

### 11. Customs Clearance
- Application submission
- Document upload
- Status tracking
- Approval workflow
- Duty and tax calculation
- HS code management

### 12. Billing & Tariff
- Invoice generation
- Service-wise billing
- Payment tracking
- Revenue reports
- Customer management
- Multi-currency support

---

## 🔐 Security Features

### Authentication
- **JWT (JSON Web Tokens)** for stateless authentication
- **Bcrypt password hashing** with salt rounds = 10
- **Token expiration** (7 days configurable)
- **Secure password storage** (never stored in plain text)

### Authorization
- **Role-based access control (RBAC)**
- **Route-level protection** via middleware
- **API endpoint restrictions** based on user role
- **Data isolation** (users only see their own data)

### Data Protection
- **Password exclusion** from API responses
- **Input validation** on both frontend and backend
- **MongoDB injection prevention** via Mongoose
- **CORS configuration** for cross-origin security
- **Environment variables** for sensitive data

### Error Handling
- **Custom error middleware** for consistent responses
- **Client-side error interception**
- **Automatic token refresh** handling
- **Graceful degradation** on errors

---

## 📱 Responsive Design

### Desktop View (1920×1080)
- Full sidebar navigation
- Multi-column layouts
- Data tables with all columns
- Advanced visualizations
- Keyboard shortcuts

### Mobile View (393×852)
- Bottom tab navigation
- Single-column layouts
- Swipeable cards
- Mobile-optimized forms
- Touch-friendly buttons

### Tablet View (768×1024)
- Collapsible sidebar
- 2-column layouts
- Adaptive tables
- Medium-sized components

---

## 🎨 UI/UX Features

### Design System
- **Dark mode theme** with slate color palette
- **Neon accents** (emerald, orange, blue)
- **Glass morphism** effects
- **Mission-control aesthetic**
- **Professional typography**

### Interactive Elements
- **Animated backgrounds**
- **Hover effects**
- **Loading states**
- **Skeleton screens**
- **Toast notifications**
- **Modal dialogs**

### Accessibility
- **Keyboard navigation**
- **Screen reader support**
- **High contrast mode**
- **Clear focus indicators**
- **Alt text for images**

---

## 🔧 API Architecture

### RESTful Design
- **Standard HTTP methods** (GET, POST, PUT, PATCH, DELETE)
- **Meaningful resource URLs**
- **Consistent response format**
- **HTTP status codes** (200, 201, 400, 401, 403, 404, 500)

### Endpoint Structure
```
/api/resource                   # List all
/api/resource/:id               # Get single
/api/resource                   # Create (POST)
/api/resource/:id               # Update (PUT)
/api/resource/:id               # Delete
/api/resource/:id/action        # Custom actions
```

### Response Format
**Success:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🗄️ Database Design

### Collections (9 total)
1. **users** - User accounts and authentication
2. **vessels** - Ship/vessel information
3. **containers** - Container inventory
4. **reefers** - Refrigerated container monitoring
5. **gates** - Gate operations and transactions
6. **trucks** - Truck appointment bookings
7. **customs** - Customs clearance applications
8. **rails** - Rail transportation schedules
9. **billings** - Invoices and payments

### Data Relationships
- **One-to-Many**: User → Vessels, Vessel → Containers
- **Embedded Documents**: Gate transactions, Reefer alerts
- **References**: ObjectId for relationships

### Performance Optimization
- **Indexed fields** for fast queries
- **Sparse indexes** for optional unique fields
- **Compound indexes** for complex queries

---

## 🚀 Deployment

### Local Development
```bash
# Frontend
npm run dev              # Port 5173

# Backend
cd server
npm run dev              # Port 5000
```

### Production Build
```bash
# Frontend
npm run build            # Creates dist/ folder

# Backend
NODE_ENV=production node server/server.js
```

### Environment Variables
**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bdportflow
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | Installation and setup guide |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Database schema details |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | This document |

---

## 🧪 Testing

### Manual Testing
- **Login flow** with different roles
- **CRUD operations** for each module
- **Role-based access** verification
- **Responsive design** on different devices
- **API endpoints** using Postman/cURL

### Test Credentials
After running `npm run seed`:
```
admin@bdport.gov.bd / admin123
operator@bdport.gov.bd / operator123
berth@bdport.gov.bd / berth123
customs@bdport.gov.bd / customs123
finance@bdport.gov.bd / finance123
driver@bdport.gov.bd / driver123
```

---

## 📈 Future Enhancements

### Phase 2 Features
- [ ] Real-time websocket updates
- [ ] Advanced analytics dashboard
- [ ] PDF report generation
- [ ] Email notifications
- [ ] SMS integration
- [ ] Mobile app (React Native)

### Phase 3 Features
- [ ] AI-powered yard optimization
- [ ] Predictive analytics
- [ ] IoT sensor integration
- [ ] Blockchain for documentation
- [ ] Multi-language support
- [ ] Advanced reporting

---

## 🤝 Contributing

This is an academic project for Software Engineering coursework. 

**Development Team:**
- Frontend Development
- Backend Development
- Database Design
- UI/UX Design
- Testing & QA

---

## 📄 License

This project is developed as part of academic coursework and is intended for educational purposes only.

---

## 🆘 Support

### Getting Help
1. Check [SETUP.md](./SETUP.md) for installation issues
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API usage
3. Examine [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data structures

### Common Issues
- **MongoDB connection errors**: Ensure MongoDB is running
- **Port conflicts**: Change ports in .env files
- **CORS errors**: Verify CLIENT_URL matches frontend URL
- **Authentication errors**: Check JWT_SECRET consistency

---

## 🎓 Academic Context

**Course:** Software Engineering  
**Project Type:** Full-stack web application  
**Duration:** Academic semester  
**Objective:** Build a production-ready MERN stack application

### Learning Outcomes
✅ Full-stack development with MERN  
✅ RESTful API design and implementation  
✅ Database modeling and optimization  
✅ Authentication and authorization  
✅ Role-based access control  
✅ Responsive UI/UX design  
✅ Professional project documentation  
✅ Git version control

---

## 📊 Project Statistics

- **Frontend Components:** 40+
- **Backend Routes:** 60+
- **API Endpoints:** 70+
- **Database Collections:** 9
- **User Roles:** 6
- **System Modules:** 12
- **Lines of Code:** ~15,000+

---

**Last Updated:** March 9, 2024  
**Version:** 1.0.0 (MERN Stack Complete)
