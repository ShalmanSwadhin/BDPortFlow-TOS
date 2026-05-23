# BDPortFlow Database Schema Documentation

## 📊 Database Overview

**Database Name:** `bdportflow`  
**Database Type:** MongoDB (NoSQL)  
**ODM:** Mongoose

## 📋 Collections

1. [Users](#users)
2. [Vessels](#vessels)
3. [Containers](#containers)
4. [Reefers](#reefers)
5. [Gates](#gates)
6. [Trucks](#trucks)
7. [Customs](#customs)
8. [Rails](#rails)
9. [Billings](#billings)

---

## 👥 Users

**Collection:** `users`

**Description:** Stores user accounts with role-based access control

**Schema:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | - | Unique identifier |
| `name` | String | Yes | - | Full name |
| `email` | String | Yes | - | Unique email (lowercase) |
| `password` | String | Yes | - | Hashed password (bcrypt) |
| `role` | String | Yes | 'operator' | User role (admin, operator, berth, customs, finance, truck) |
| `status` | String | No | 'active' | Account status (active, inactive) |
| `lastLogin` | Date | No | Now | Last login timestamp |
| `createdAt` | Date | Auto | - | Account creation timestamp |
| `updatedAt` | Date | Auto | - | Last update timestamp |

**Indexes:**
- `email`: Unique index for fast lookup and uniqueness constraint

**Methods:**
- `comparePassword(candidatePassword)`: Compares plain password with hashed password
- `toJSON()`: Removes password field from user object

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Admin User",
  "email": "admin@bdport.gov.bd",
  "password": "$2a$10$...",
  "role": "admin",
  "status": "active",
  "lastLogin": "2024-03-09T10:30:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-03-09T10:30:00.000Z"
}
```

---

## 🚢 Vessels

**Collection:** `vessels`

**Description:** Stores vessel (ship) information and berth assignments

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `vesselName` | String | Yes | Name of the vessel |
| `imoNumber` | String | No | International Maritime Organization number (unique) |
| `vesselType` | String | Yes | Type: Container, Bulk, Tanker, General Cargo, RoRo |
| `flag` | String | No | Country of registration |
| `length` | Number | Yes | Vessel length in meters |
| `breadth` | Number | Yes | Vessel breadth in meters |
| `draft` | Number | Yes | Vessel draft in meters |
| `berthNumber` | String | Yes | Assigned berth (e.g., "Berth-1") |
| `eta` | Date | Yes | Estimated Time of Arrival |
| `etd` | Date | Yes | Estimated Time of Departure |
| `totalContainers` | Number | No | Total container capacity |
| `loadedContainers` | Number | No | Number of containers loaded |
| `progress` | Number | No | Loading/unloading progress (0-100%) |
| `status` | String | Yes | Status: scheduled, berthed, loading, unloading, departed |
| `cargoDetails` | String | No | Description of cargo |
| `agent` | String | No | Shipping agent/line |
| `createdBy` | ObjectId | No | Reference to User who created record |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `vesselName`: For fast name searches
- `status`: For filtering by status
- `berthNumber`: For berth availability checks

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
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
  "agent": "Maersk Line",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-01T00:00:00.000Z",
  "updatedAt": "2024-03-09T10:00:00.000Z"
}
```

---

## 📦 Containers

**Collection:** `containers`

**Description:** Stores container information and locations

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `containerId` | String | Yes | Container ID (unique, uppercase) |
| `type` | String | Yes | Type: 20ft, 40ft, 40ft HC, reefer, tank, flat rack, open top |
| `size` | String | Yes | Size: 20, 40, 45 |
| `status` | String | Yes | Status: Empty, Full, In Transit, At Berth, In Yard, etc. |
| `location` | Object | Yes | Storage location details |
| `location.block` | String | Yes | Block identifier (e.g., "A-1") |
| `location.bay` | String | No | Bay position |
| `location.row` | String | No | Row position |
| `location.tier` | String | No | Tier/stack level |
| `weight` | Number | Yes | Container weight in kg |
| `cargo` | String | No | Cargo description |
| `vessel` | ObjectId | No | Reference to Vessel |
| `vesselName` | String | No | Vessel name for quick access |
| `consignee` | String | No | Consignee name |
| `origin` | String | No | Origin location |
| `destination` | String | No | Destination location |
| `arrivalDate` | Date | No | Date container arrived at port |
| `departureDate` | Date | No | Date container departed |
| `hazmat` | Boolean | No | Is hazardous material |
| `hazmatClass` | String | No | Hazmat classification |
| `temperature` | Number | No | Required temperature for reefers |
| `customsStatus` | String | No | Customs status: Pending, Cleared, Hold, Rejected |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `containerId`: Unique index
- `status`: For filtering
- `location.block`: For location searches
- `vesselName`: For vessel-related queries

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
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
  "vessel": "507f1f77bcf86cd799439012",
  "vesselName": "MV HARMONY",
  "consignee": "Tech Import Ltd",
  "origin": "Shanghai",
  "destination": "Dhaka",
  "arrivalDate": "2024-03-05T00:00:00.000Z",
  "hazmat": false,
  "customsStatus": "Pending",
  "createdAt": "2024-03-05T10:00:00.000Z",
  "updatedAt": "2024-03-09T15:00:00.000Z"
}
```

---

## 🌡️ Reefers

**Collection:** `reefers`

**Description:** Stores refrigerated container monitoring data

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `containerId` | String | Yes | Container ID (unique) |
| `location` | String | Yes | Physical location |
| `currentTemp` | Number | Yes | Current temperature in °C |
| `setPoint` | Number | Yes | Target temperature in °C |
| `status` | String | Yes | Status: Normal, Warning, Critical, Offline |
| `powerStatus` | String | Yes | Power: Connected, Disconnected |
| `cargo` | String | No | Cargo type |
| `humidity` | Number | No | Humidity percentage (0-100) |
| `ventilation` | Number | No | Ventilation settings |
| `alerts` | Array | No | Array of alert objects |
| `alerts[].type` | String | - | Alert type |
| `alerts[].message` | String | - | Alert message |
| `alerts[].timestamp` | Date | - | Alert timestamp |
| `alerts[].severity` | String | - | Severity: Low, Medium, High, Critical |
| `history` | Array | No | Temperature history |
| `lastMaintenance` | Date | No | Last maintenance date |
| `nextMaintenance` | Date | No | Next scheduled maintenance |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `containerId`: Unique index
- `status`: For filtering
- `powerStatus`: For power status checks

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "containerId": "CMAU3456789",
  "location": "Block R-1",
  "currentTemp": -18.5,
  "setPoint": -18.0,
  "status": "Normal",
  "powerStatus": "Connected",
  "cargo": "Frozen Fish",
  "humidity": 65,
  "alerts": [
    {
      "type": "Temperature",
      "message": "Temperature slightly above setpoint",
      "timestamp": "2024-03-09T12:00:00.000Z",
      "severity": "Low"
    }
  ],
  "history": [
    {
      "temperature": -18.2,
      "timestamp": "2024-03-09T10:00:00.000Z"
    }
  ],
  "createdAt": "2024-03-05T00:00:00.000Z",
  "updatedAt": "2024-03-09T12:30:00.000Z"
}
```

---

## 🚪 Gates

**Collection:** `gates`

**Description:** Stores gate information and transaction history

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `gateNumber` | String | Yes | Gate identifier (unique) |
| `status` | String | Yes | Status: Open, Closed, Busy |
| `currentVehicle` | String | No | Currently processing vehicle |
| `waitingCount` | Number | No | Number of vehicles waiting |
| `processedToday` | Number | No | Transactions processed today |
| `transactions` | Array | No | Transaction history |
| `transactions[].truckNumber` | String | Yes | Truck license plate |
| `transactions[].driverName` | String | Yes | Driver name |
| `transactions[].containerId` | String | Yes | Container ID |
| `transactions[].type` | String | Yes | Type: Entry, Exit |
| `transactions[].weight` | Number | No | Container weight |
| `transactions[].purpose` | String | Yes | Purpose: Delivery, Pickup, Empty Return |
| `transactions[].timestamp` | Date | Yes | Transaction time |
| `transactions[].processedBy` | ObjectId | No | User who processed |
| `transactions[].gatePass` | String | No | Generated gate pass number |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `gateNumber`: Unique index
- `status`: For filtering

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "gateNumber": "Gate-1",
  "status": "Open",
  "waitingCount": 3,
  "processedToday": 45,
  "transactions": [
    {
      "truckNumber": "DHA-GA-1234",
      "driverName": "Ahmed Khan",
      "containerId": "TCLU4567890",
      "type": "Entry",
      "weight": 24000,
      "purpose": "Delivery",
      "timestamp": "2024-03-09T14:30:00.000Z",
      "processedBy": "507f1f77bcf86cd799439011",
      "gatePass": "GP-1710000000000"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-03-09T14:30:00.000Z"
}
```

---

## 🚚 Trucks

**Collection:** `trucks`

**Description:** Stores truck appointment bookings

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `truckNumber` | String | Yes | Truck license plate (unique, uppercase) |
| `driverName` | String | Yes | Driver name |
| `driverContact` | String | Yes | Driver contact number |
| `company` | String | No | Transport company |
| `containerId` | String | Yes | Container ID |
| `appointmentDate` | Date | Yes | Appointment date |
| `appointmentTime` | String | Yes | Appointment time slot |
| `status` | String | Yes | Status: Scheduled, Arrived, In Progress, Completed, Cancelled |
| `purpose` | String | Yes | Purpose: Delivery, Pickup, Empty Return |
| `gateNumber` | String | No | Assigned gate |
| `qrCode` | String | No | QR code for appointment (unique) |
| `checkInTime` | Date | No | Check-in timestamp |
| `checkOutTime` | Date | No | Check-out timestamp |
| `user` | ObjectId | No | Reference to User (truck driver) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `truckNumber`: For searches
- `status`: For filtering
- `appointmentDate`: For date-based queries

**Middleware:**
- Pre-save hook generates unique QR code if not provided

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "truckNumber": "DHA-GA-1234",
  "driverName": "Ahmed Khan",
  "driverContact": "+880 1234567890",
  "company": "ABC Transport",
  "containerId": "TCLU4567890",
  "appointmentDate": "2024-03-10T00:00:00.000Z",
  "appointmentTime": "14:30",
  "status": "Scheduled",
  "purpose": "Delivery",
  "qrCode": "QR-DHA-GA-1234-1710000000000",
  "user": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-08T10:00:00.000Z",
  "updatedAt": "2024-03-08T10:00:00.000Z"
}
```

---

## 📋 Customs

**Collection:** `customs`

**Description:** Stores customs clearance applications

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `containerId` | String | Yes | Container ID (unique) |
| `billOfLading` | String | Yes | Bill of Lading number |
| `importer` | String | Yes | Importer company name |
| `exporter` | String | No | Exporter company name |
| `cargoDescription` | String | Yes | Description of cargo |
| `hsCode` | String | No | Harmonized System code |
| `value` | Number | Yes | Cargo value |
| `currency` | String | Yes | Currency: USD, BDT, EUR, GBP |
| `weight` | Number | Yes | Cargo weight in kg |
| `quantity` | Number | No | Number of items |
| `origin` | String | Yes | Country of origin |
| `destination` | String | Yes | Destination country |
| `status` | String | Yes | Status: Pending, Under Review, Cleared, Hold, Rejected |
| `submittedDate` | Date | Yes | Submission date |
| `reviewedDate` | Date | No | Review date |
| `clearedDate` | Date | No | Clearance date |
| `documents` | Array | No | Uploaded documents |
| `dutyAmount` | Number | No | Duty amount |
| `taxAmount` | Number | No | Tax amount |
| `totalCharges` | Number | No | Total charges |
| `remarks` | String | No | Officer remarks |
| `officer` | ObjectId | No | Reference to customs officer |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `containerId`: Unique index
- `status`: For filtering
- `submittedDate`: For date-based queries

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "containerId": "TCLU4567890",
  "billOfLading": "BL-2024-001",
  "importer": "Tech Import Ltd",
  "exporter": "China Export Co",
  "cargoDescription": "Electronics - Mobile Phones",
  "hsCode": "8517.12.00",
  "value": 50000,
  "currency": "USD",
  "weight": 24000,
  "quantity": 1000,
  "origin": "China",
  "destination": "Bangladesh",
  "status": "Pending",
  "submittedDate": "2024-03-09T10:00:00.000Z",
  "documents": [
    {
      "name": "Invoice.pdf",
      "type": "application/pdf",
      "uploadDate": "2024-03-09T10:00:00.000Z"
    }
  ],
  "createdAt": "2024-03-09T10:00:00.000Z",
  "updatedAt": "2024-03-09T10:00:00.000Z"
}
```

---

## 🚂 Rails

**Collection:** `rails`

**Description:** Stores rail transportation schedules

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `trainNumber` | String | Yes | Train identifier |
| `destination` | String | Yes | Destination city |
| `departureTime` | Date | Yes | Scheduled departure |
| `status` | String | Yes | Status: Scheduled, Loading, Departed, Delayed, Cancelled |
| `capacity` | Number | Yes | Total container capacity |
| `loaded` | Number | No | Number of containers loaded |
| `containers` | Array | No | Loaded containers |
| `containers[].containerId` | String | Yes | Container ID |
| `containers[].weight` | Number | No | Container weight |
| `containers[].type` | String | No | Container type |
| `containers[].loadedAt` | Date | No | Load timestamp |
| `operator` | String | No | Railway operator |
| `route` | String | No | Route description |
| `estimatedArrival` | Date | No | Estimated arrival time |
| `createdBy` | ObjectId | No | Reference to User |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `trainNumber`: For searches
- `status`: For filtering
- `departureTime`: For schedule queries

**Virtual Field:**
- `loadedPercentage`: Calculated as (loaded / capacity) * 100

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439018",
  "trainNumber": "TR-001",
  "destination": "Dhaka",
  "departureTime": "2024-03-12T08:00:00.000Z",
  "status": "Loading",
  "capacity": 40,
  "loaded": 25,
  "containers": [
    {
      "containerId": "TCLU4567890",
      "weight": 24000,
      "type": "40ft",
      "loadedAt": "2024-03-11T14:00:00.000Z"
    }
  ],
  "operator": "Bangladesh Railway",
  "route": "Chittagong - Dhaka",
  "estimatedArrival": "2024-03-12T20:00:00.000Z",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-10T00:00:00.000Z",
  "updatedAt": "2024-03-11T14:00:00.000Z"
}
```

---

## 💰 Billings

**Collection:** `billings`

**Description:** Stores invoices and billing records

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Unique identifier |
| `invoiceNumber` | String | Yes | Auto-generated invoice number (unique) |
| `customerName` | String | Yes | Customer/company name |
| `customerEmail` | String | Yes | Customer email |
| `customerAddress` | String | No | Customer address |
| `vesselName` | String | No | Associated vessel |
| `containerId` | String | No | Associated container |
| `services` | Array | Yes | Line items |
| `services[].description` | String | Yes | Service description |
| `services[].quantity` | Number | No | Quantity |
| `services[].rate` | Number | Yes | Rate per unit |
| `services[].amount` | Number | Yes | Total amount |
| `subtotal` | Number | Yes | Subtotal before tax |
| `tax` | Number | No | Tax amount |
| `discount` | Number | No | Discount amount |
| `total` | Number | Yes | Total amount |
| `currency` | String | Yes | Currency: USD, BDT |
| `status` | String | Yes | Status: Draft, Pending, Paid, Overdue, Cancelled |
| `issueDate` | Date | Yes | Invoice issue date |
| `dueDate` | Date | Yes | Payment due date |
| `paidDate` | Date | No | Payment received date |
| `paymentMethod` | String | No | Payment method |
| `notes` | String | No | Additional notes |
| `createdBy` | ObjectId | No | Reference to User |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

**Indexes:**
- `invoiceNumber`: Unique index
- `status`: For filtering
- `customerEmail`: For customer queries

**Middleware:**
- Pre-save hook auto-generates invoice number format: `INV-YYYY-#####`

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439019",
  "invoiceNumber": "INV-2024-00001",
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
      "description": "Storage Fees (5 days)",
      "quantity": 5,
      "rate": 20,
      "amount": 100
    }
  ],
  "subtotal": 5100,
  "tax": 765,
  "total": 5865,
  "currency": "USD",
  "status": "Paid",
  "issueDate": "2024-03-01T00:00:00.000Z",
  "dueDate": "2024-04-01T00:00:00.000Z",
  "paidDate": "2024-03-09T00:00:00.000Z",
  "paymentMethod": "Bank Transfer",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-03-01T10:00:00.000Z",
  "updatedAt": "2024-03-09T15:00:00.000Z"
}
```

---

## 🔗 Relationships

### One-to-Many Relationships

1. **User → Vessels**  
   - One user (operator/berth planner) can create many vessels
   - Reference: `Vessel.createdBy → User._id`

2. **Vessel → Containers**  
   - One vessel can have many containers
   - Reference: `Container.vessel → Vessel._id`

3. **User → Trucks**  
   - One user (truck driver) can have many appointments
   - Reference: `Truck.user → User._id`

4. **User → Customs**  
   - One customs officer can process many clearances
   - Reference: `Customs.officer → User._id`

5. **User → Rails**  
   - One user can create many rail schedules
   - Reference: `Rail.createdBy → User._id`

6. **User → Billings**  
   - One user (finance) can create many invoices
   - Reference: `Billing.createdBy → User._id`

### Embedded Documents

1. **Containers.location** - Embedded object for storage location
2. **Gates.transactions** - Array of embedded transaction objects
3. **Reefers.alerts** - Array of embedded alert objects
4. **Reefers.history** - Array of embedded temperature readings
5. **Customs.documents** - Array of embedded document references
6. **Rails.containers** - Array of embedded container references
7. **Billings.services** - Array of embedded line items

---

## 📊 Indexes Summary

| Collection | Indexed Fields |
|------------|----------------|
| users | email (unique) |
| vessels | vesselName, status, berthNumber |
| containers | containerId (unique), status, location.block, vesselName |
| reefers | containerId (unique), status, powerStatus |
| gates | gateNumber (unique), status |
| trucks | truckNumber, status, appointmentDate |
| customs | containerId (unique), status, submittedDate |
| rails | trainNumber, status, departureTime |
| billings | invoiceNumber (unique), status, customerEmail |

---

## 🔒 Data Validation

All schemas include:
- **Required field validation** using Mongoose `required` attribute
- **Enum validation** for status fields and fixed-value fields
- **Email validation** using regex pattern
- **Length validation** for specific fields (e.g., password minimum length)
- **Data type validation** enforced by Mongoose

---

## 🕐 Timestamps

All collections automatically include:
- `createdAt`: Set when document is first created
- `updatedAt`: Updated whenever document is modified

Configured via: `{ timestamps: true }`

---

## 🔐 Security Features

1. **Password Hashing**
   - User passwords are hashed using bcrypt with salt rounds = 10
   - Pre-save middleware automatically hashes passwords

2. **Sensitive Data Protection**
   - Password field excluded from queries by default (`select: false`)
   - Password removed from JSON responses via `toJSON()` method

3. **Input Sanitization**
   - MongoDB injection prevention through Mongoose schema validation
   - Trim applied to string fields
   - Lowercase enforcement for email fields

---

## 📝 Notes

- All ObjectId references use Mongoose's population feature for joins
- Virtual fields are not stored in database but calculated on retrieval
- Middleware hooks (pre/post) handle automatic field updates
- All dates stored in UTC timezone
- Currency values stored as numbers (not strings)
- Container IDs automatically converted to uppercase
