# BDPortFlow API Documentation

## 📌 Overview

Base URL: `http://localhost:5000/api`

All API endpoints return JSON responses with the following structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@bdport.gov.bd",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@bdport.gov.bd",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "operator"
}
```

### Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@bdport.gov.bd",
    "role": "admin",
    "status": "active"
  }
}
```

### Update Password
**Endpoint:** `PUT /api/auth/updatepassword`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

## 👥 Users

### Get All Users
**Endpoint:** `GET /api/users`

**Access:** Admin only

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "...",
      "name": "Admin User",
      "email": "admin@bdport.gov.bd",
      "role": "admin",
      "status": "active",
      "createdAt": "2024-03-09T10:00:00.000Z"
    }
  ]
}
```

### Create User
**Endpoint:** `POST /api/users`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@bdport.gov.bd",
  "password": "password123",
  "role": "operator",
  "status": "active"
}
```

### Update User
**Endpoint:** `PUT /api/users/:id`

**Access:** Admin only

### Delete User
**Endpoint:** `DELETE /api/users/:id`

**Access:** Admin only

### Toggle User Status
**Endpoint:** `PATCH /api/users/:id/status`

**Access:** Admin only

---

## 🚢 Vessels

### Get All Vessels
**Endpoint:** `GET /api/vessels`

**Query Parameters:**
- `status` - Filter by status (scheduled, berthed, loading, unloading, departed)
- `berthNumber` - Filter by berth number

**Example:** `GET /api/vessels?status=berthed`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "...",
      "vesselName": "MV HARMONY",
      "imoNumber": "IMO9876543",
      "vesselType": "Container",
      "flag": "Singapore",
      "length": 280,
      "breadth": 40,
      "draft": 12.5,
      "berthNumber": "Berth-1",
      "eta": "2024-03-10T08:00:00.000Z",
      "etd": "2024-03-12T18:00:00.000Z",
      "totalContainers": 245,
      "loadedContainers": 160,
      "progress": 65,
      "status": "loading",
      "agent": "Maersk Line"
    }
  ]
}
```

### Create Vessel
**Endpoint:** `POST /api/vessels`

**Access:** Admin, Berth, Operator

**Request Body:**
```json
{
  "vesselName": "MV TEST SHIP",
  "imoNumber": "IMO1234567",
  "vesselType": "Container",
  "flag": "Bangladesh",
  "length": 300,
  "breadth": 45,
  "draft": 13.0,
  "berthNumber": "Berth-3",
  "eta": "2024-03-15T10:00:00.000Z",
  "etd": "2024-03-16T18:00:00.000Z",
  "totalContainers": 300,
  "agent": "Test Shipping Line"
}
```

### Update Vessel
**Endpoint:** `PUT /api/vessels/:id`

### Update Vessel Progress
**Endpoint:** `PATCH /api/vessels/:id/progress`

**Request Body:**
```json
{
  "loadedContainers": 200,
  "progress": 80
}
```

---

## 📦 Containers

### Get All Containers
**Endpoint:** `GET /api/containers`

**Query Parameters:**
- `status` - Filter by status
- `location` - Filter by block location
- `vesselName` - Filter by vessel

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "...",
      "containerId": "TCLU4567890",
      "type": "40ft",
      "size": "40",
      "status": "In Yard",
      "location": {
        "block": "A-1",
        "bay": "05",
        "row": "03",
        "tier": "02"
      },
      "weight": 24000,
      "cargo": "Electronics",
      "vesselName": "MV HARMONY",
      "consignee": "Tech Import Ltd",
      "origin": "Shanghai",
      "destination": "Dhaka",
      "hazmat": false
    }
  ]
}
```

### Search Containers
**Endpoint:** `GET /api/containers/search/:query`

**Example:** `GET /api/containers/search/TCLU`

### Get Containers by Block
**Endpoint:** `GET /api/containers/block/:block`

**Example:** `GET /api/containers/block/A-1`

### Create Container
**Endpoint:** `POST /api/containers`

**Request Body:**
```json
{
  "containerId": "TEST1234567",
  "type": "40ft",
  "size": "40",
  "status": "In Yard",
  "location": {
    "block": "B-2",
    "bay": "10",
    "row": "05",
    "tier": "01"
  },
  "weight": 22000,
  "cargo": "Textiles",
  "vesselName": "MV TEST",
  "consignee": "ABC Company",
  "origin": "China",
  "destination": "Bangladesh"
}
```

---

## 🌡️ Reefers

### Get All Reefers
**Endpoint:** `GET /api/reefers`

**Query Parameters:**
- `status` - Filter by status (Normal, Warning, Critical, Offline)
- `powerStatus` - Filter by power status (Connected, Disconnected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "containerId": "CMAU3456789",
      "location": "Block R-1",
      "currentTemp": -18.5,
      "setPoint": -18.0,
      "status": "Normal",
      "powerStatus": "Connected",
      "cargo": "Frozen Fish",
      "humidity": 65,
      "alerts": []
    }
  ]
}
```

### Add Alert to Reefer
**Endpoint:** `POST /api/reefers/:id/alert`

**Request Body:**
```json
{
  "type": "Temperature",
  "message": "Temperature deviation detected",
  "severity": "Medium"
}
```

---

## 🚪 Gates

### Get All Gates
**Endpoint:** `GET /api/gates`

### Process Gate Transaction
**Endpoint:** `POST /api/gates/:id/transaction`

**Request Body:**
```json
{
  "truckNumber": "DHA-GA-1234",
  "driverName": "Ahmed Khan",
  "containerId": "TCLU4567890",
  "type": "Entry",
  "weight": 24000,
  "purpose": "Delivery"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction processed successfully",
  "data": {
    "gate": { ... },
    "gatePass": "GP-1710000000000"
  }
}
```

---

## 🚚 Trucks

### Get All Truck Appointments
**Endpoint:** `GET /api/trucks`

**Query Parameters:**
- `status` - Filter by status
- `appointmentDate` - Filter by date

**Note:** Truck drivers only see their own bookings

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "truckNumber": "DHA-GA-1234",
      "driverName": "Ahmed Khan",
      "driverContact": "+880 1234567890",
      "containerId": "TCLU4567890",
      "appointmentDate": "2024-03-10T00:00:00.000Z",
      "appointmentTime": "14:30",
      "status": "Scheduled",
      "purpose": "Delivery",
      "qrCode": "QR-DHA-GA-1234-1710000000000"
    }
  ]
}
```

### Create Truck Appointment
**Endpoint:** `POST /api/trucks`

**Request Body:**
```json
{
  "truckNumber": "DHA-GA-5678",
  "driverName": "John Doe",
  "driverContact": "+880 1987654321",
  "company": "ABC Transport",
  "containerId": "TCLU9876543",
  "appointmentDate": "2024-03-12",
  "appointmentTime": "10:00",
  "purpose": "Pickup"
}
```

### Check-in Truck
**Endpoint:** `PATCH /api/trucks/:id/checkin`

### Check-out Truck
**Endpoint:** `PATCH /api/trucks/:id/checkout`

---

## 📋 Customs

### Get All Customs Clearances
**Endpoint:** `GET /api/customs`

**Query Parameters:**
- `status` - Filter by status (Pending, Under Review, Cleared, Hold, Rejected)

### Create Customs Clearance
**Endpoint:** `POST /api/customs`

**Request Body:**
```json
{
  "containerId": "TCLU4567890",
  "billOfLading": "BL-2024-001",
  "importer": "ABC Import Ltd",
  "exporter": "XYZ Export Co",
  "cargoDescription": "Electronics",
  "hsCode": "8471.30.00",
  "value": 50000,
  "currency": "USD",
  "weight": 24000,
  "quantity": 100,
  "origin": "China",
  "destination": "Bangladesh"
}
```

### Approve Clearance
**Endpoint:** `PATCH /api/customs/:id/approve`

**Access:** Admin, Customs

**Request Body:**
```json
{
  "remarks": "All documents verified and approved"
}
```

### Reject Clearance
**Endpoint:** `PATCH /api/customs/:id/reject`

### Hold Clearance
**Endpoint:** `PATCH /api/customs/:id/hold`

---

## 🚂 Rail Coordination

### Get All Rail Schedules
**Endpoint:** `GET /api/rails`

### Create Rail Schedule
**Endpoint:** `POST /api/rails`

**Request Body:**
```json
{
  "trainNumber": "TR-001",
  "destination": "Dhaka",
  "departureTime": "2024-03-12T08:00:00.000Z",
  "capacity": 40,
  "route": "Chittagong - Dhaka"
}
```

### Add Container to Rail
**Endpoint:** `POST /api/rails/:id/container`

**Request Body:**
```json
{
  "containerId": "TCLU4567890",
  "weight": 24000,
  "type": "40ft"
}
```

### Remove Container from Rail
**Endpoint:** `DELETE /api/rails/:id/container/:containerId`

---

## 💰 Billing

### Get All Invoices
**Endpoint:** `GET /api/billing`

**Query Parameters:**
- `status` - Filter by status (Draft, Pending, Paid, Overdue, Cancelled)
- `customerEmail` - Filter by customer

### Create Invoice
**Endpoint:** `POST /api/billing`

**Access:** Admin, Finance

**Request Body:**
```json
{
  "customerName": "ABC Shipping Ltd",
  "customerEmail": "billing@abcshipping.com",
  "vesselName": "MV HARMONY",
  "services": [
    {
      "description": "Container Handling",
      "quantity": 100,
      "rate": 50,
      "amount": 5000
    },
    {
      "description": "Storage Fees",
      "quantity": 5,
      "rate": 20,
      "amount": 100
    }
  ],
  "subtotal": 5100,
  "tax": 765,
  "total": 5865,
  "dueDate": "2024-04-10"
}
```

### Mark Invoice as Paid
**Endpoint:** `PATCH /api/billing/:id/paid`

**Request Body:**
```json
{
  "paymentMethod": "Bank Transfer"
}
```

### Get Revenue
**Endpoint:** `GET /api/billing/revenue`

**Access:** Admin, Finance

**Query Parameters:**
- `startDate` - Start date for revenue calculation
- `endDate` - End date for revenue calculation

---

## 📊 Dashboard

### Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "vessels": {
      "total": 15,
      "active": 8
    },
    "containers": {
      "total": 5432,
      "inYard": 3210
    },
    "yardDensity": {
      "percentage": 64,
      "capacity": 5000,
      "occupied": 3210
    },
    "gates": {
      "total": 4,
      "processedToday": 176
    },
    "reefers": {
      "active": 45,
      "alerts": 3
    },
    "revenue": {
      "last30Days": 2450000
    }
  }
}
```

### Get Recent Activity
**Endpoint:** `GET /api/dashboard/activity`

### Get Chart Data
**Endpoint:** `GET /api/dashboard/charts`

**Query Parameters:**
- `type` - Chart type (revenue, containers, gates)
- `days` - Number of days (default: 7)

---

## 🏗️ Berths

### Get All Berths
**Endpoint:** `GET /api/berths`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "berthNumber": "Berth-1",
      "status": "occupied",
      "vessel": {
        "vesselName": "MV HARMONY",
        "status": "loading"
      }
    },
    {
      "berthNumber": "Berth-2",
      "status": "available",
      "vessel": null
    }
  ]
}
```

### Assign Berth to Vessel
**Endpoint:** `POST /api/berths/assign`

**Request Body:**
```json
{
  "vesselId": "507f1f77bcf86cd799439011",
  "berthNumber": "Berth-3"
}
```

### Release Berth
**Endpoint:** `POST /api/berths/release`

**Request Body:**
```json
{
  "vesselId": "507f1f77bcf86cd799439011"
}
```

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## 🔒 Role-Based Access Control

| Role | Access Level |
|------|--------------|
| **admin** | Full access to all endpoints |
| **operator** | Vessels, containers, gates, reefers |
| **berth** | Vessels, berths, scheduling |
| **customs** | Customs clearances |
| **finance** | Billing and invoices |
| **truck** | Own truck appointments only |

## 📝 Notes

- All dates are in ISO 8601 format
- All timestamps are in UTC
- Pagination is not implemented yet (future enhancement)
- Rate limiting is not implemented (future enhancement)
