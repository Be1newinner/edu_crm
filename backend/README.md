# CRM Backend API Documentation

**Institute CRM**  
*Student-centric: Individual study OR optional batch enrollment. No academic year division.*

---

## 🗃️ Database Schemas (Mongoose)

### 1. Institute Schema
```javascript
const InstituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailDomain: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 2. User Schema
```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'TEACHER', 'STAFF', 'ADMIN'], required: true },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 3. Role Schema
```javascript
const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }], // ["users:read", "academic:create"]
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true }
});
```

### 4. Batch Schema
```javascript
const BatchSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true },
  maxCapacity: Number,
  startDate: Date,
  description: String,
  currentEnrollment: { type: Number, default: 0 },
  courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 5. Course Schema
```javascript
const CourseSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  durationMonths: Number,
  credits: Number,
  feeAmount: Number,
  description: String,
  prerequisites: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6. Student Schema
```javascript
const StudentSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
  address: String,
  phone: String,
  guardianName: String,
  guardianPhone: String,
  batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  individualStudy: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['PROSPECT', 'ENROLLED', 'DROPPED', 'ALUMNI'],
    default: 'PROSPECT'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 7. Staff Schema
```javascript
const StaffSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  department: String,
  qualification: String,
  dateOfJoining: { type: Date, required: true },
  salaryGrade: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```
### 8. AttendanceSession Schema
```javascript
const AttendanceSessionSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },        // Optional for individual students
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },    // For individual attendance
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },  // Teacher who marked
  sessionDate: { type: Date, required: true },
  sessionTime: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'], required: true },
  remarks: String,
  createdAt: { type: Date, default: Date.now }
});
```

### 9. FeeTemplate Schema
```javascript
const FeeTemplateSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true },              // "Course Fee Q1", "Admission Fee"
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  components: [{
    name: String,         // "Tuition", "Exam", "Library"
    amount: Number,
    dueDate: Date
  }],
  totalAmount: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 10. StudentFee Schema
```javascript
const StudentFeeSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeTemplate' },
  invoiceNumber: { type: String, required: true, unique: true },
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'],
    default: 'PENDING'
  },
  payments: [{
    amount: Number,
    paymentDate: Date,
    method: { type: String, enum: ['CASH', 'UPI', 'CARD', 'BANK', 'ONLINE'] },
    transactionId: String,
    paidBy: String
  }],
  createdAt: { type: Date, default: Date.now }
});
```

### 11. FileUpload Schema
```javascript
const FileUploadSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },      // Cloudinary/public URL
  mimeType: String,
  size: Number,
  ownerType: { type: String, enum: ['STUDENT', 'STAFF', 'COURSE', 'BATCH'] },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  tags: [String],                                  // ["id-proof", "fee-receipt"]
  visibility: { type: String, enum: ['PUBLIC', 'PRIVATE', 'ROLE_BASED'], default: 'PRIVATE' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🚀 APIs - Core Identity

### Auth Module

#### `POST /auth/register`
**Register new user (Admin only)**

**Expected Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "STUDENT",
  "instituteId": "inst123"
}
```
**Expected Response:**
```json
{
  "userId": "user123",
  "email": "john@example.com",
  "role": "STUDENT",
  "createdAt": "2025-12-02T10:00:00Z"
}
```

#### `POST /auth/login`

**Expected Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```
**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "instituteId": "inst123"
  }
}
```

#### `POST /auth/refresh`

**Expected Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Expected Response:**
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### `POST /auth/logout`

**Expected Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Expected Response:**
```json
{
  "success": true
}
```

#### `GET /auth/me`

**Expected Request:** (No body)

**Expected Response:**
```json
{
  "userId": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "instituteId": "inst123"
}
```

### Roles Module

#### `GET /roles`

**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "id": "role1",
    "name": "STUDENT",
    "permissions": ["self:read"]
  },
  {
    "id": "role2",
    "name": "ADMIN",
    "permissions": ["users:create", "academic:*"]
  }
]
```

#### `POST /roles`

**Expected Request:**
```json
{
  "name": "TEACHER",
  "permissions": ["academic:read", "attendance:mark"]
}
```
**Expected Response:**
```json
{
  "id": "role3",
  "name": "TEACHER",
  "permissions": ["academic:read", "attendance:mark"]
}
```

#### `PATCH /roles/{id}`

**Expected Request:**
```json
{
  "permissions": ["academic:read", "attendance:mark", "self:update"]
}
```
**Expected Response:**
```json
{
  "id": "role3",
  "name": "TEACHER",
  "permissions": ["academic:read", "attendance:mark", "self:update"]
}
```

### Users Module

#### `GET /users?role=STUDENT&search=john`

**Expected Request:** (No body)

**Expected Response:**
```json
{
  "users": [
    {
      "userId": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "createdAt": "2025-12-02T10:00:00Z"
    }
  ]
}
```

#### `POST /users`

**Expected Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123",
  "role": "TEACHER",
  "instituteId": "inst123"
}
```
**Expected Response:**
```json
{
  "userId": "user124",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "TEACHER",
  "createdAt": "2025-12-02T11:00:00Z"
}
```

#### `PATCH /users/{id}`

**Expected Request:**
```json
{
  "name": "John Updated",
  "role": "STUDENT"
}
```
**Expected Response:**
```json
{
  "userId": "user123",
  "name": "John Updated",
  "email": "john@example.com",
  "role": "STUDENT",
  "createdAt": "2025-12-02T10:00:00Z"
}
```

### Institute Module

#### `GET /institute`

**Expected Request:** (No body)

**Expected Response:**
```json
{
  "id": "inst123",
  "name": "Tech Institute",
  "emailDomain": "techinstitute.com",
  "createdAt": "2025-12-01T09:00:00Z"
}
```

#### `PATCH /institute`

**Expected Request:**
```json
{
  "name": "Tech Institute Updated"
}
```
**Expected Response:**
```json
{
  "id": "inst123",
  "name": "Tech Institute Updated",
  "emailDomain": "techinstitute.com",
  "createdAt": "2025-12-01T09:00:00Z"
}
```

---

### Batches Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/batches` | Create batch | ADMIN, STAFF |
| `GET` | `/batches` | List `?search=Evening` | ALL |
| `GET` | `/batches/:id` | Details | ALL |
| `GET` | `/batches/:id/students` | Students | TEACHER, ADMIN |
| `PATCH` | `/batches/:id` | Update | ADMIN, STAFF |
| `DELETE` | `/batches/:id` | Delete | ADMIN |

#### `POST /batches`
**Expected Request:**
```json
{
  "name": "Evening Batch 1",
  "maxCapacity": 30,
  "startDate": "2025-11-01T00:00:00Z",
  "courseIds": ["course123"],
  "description": "React Native Bootcamp"
}
```
**Expected Response:**
```json
{
  "id": "batch123",
  "name": "Evening Batch 1",
  "maxCapacity": 30,
  "startDate": "2025-11-01T00:00:00Z",
  "courseIds": ["course123"],
  "description": "React Native Bootcamp",
  "currentEnrollment": 0,
  "instituteId": "inst123"
}
```

#### `GET /batches`
**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "id": "batch123",
    "name": "Evening Batch 1",
    "maxCapacity": 30,
    "startDate": "2025-11-01T00:00:00Z",
    "courseIds": ["course123"],
    "description": "React Native Bootcamp",
    "currentEnrollment": 15,
    "instituteId": "inst123"
  },
  {
    "id": "batch124",
    "name": "Morning Batch 2",
    "maxCapacity": 25,
    "startDate": "2025-12-01T00:00:00Z",
    "courseIds": ["course124"],
    "description": "Data Science Fundamentals",
    "currentEnrollment": 20,
    "instituteId": "inst123"
  }
]
```

#### `GET /batches/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "id": "batch123",
  "name": "Evening Batch 1",
  "maxCapacity": 30,
  "startDate": "2025-11-01T00:00:00Z",
  "courseIds": ["course123"],
  "description": "React Native Bootcamp",
  "currentEnrollment": 15,
  "instituteId": "inst123"
}
```

#### `GET /batches/:id/students`
**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "studentId": "student123",
    "userId": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "STU001",
    "status": "ENROLLED"
  },
  {
    "studentId": "student124",
    "userId": "user125",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "rollNumber": "STU002",
    "status": "ENROLLED"
  }
]
```

#### `PATCH /batches/:id`
**Expected Request:**
```json
{
  "name": "Evening Batch 1 (Updated)",
  "maxCapacity": 35,
  "description": "Updated React Native Bootcamp for 2026"
}
```
**Expected Response:**
```json
{
  "id": "batch123",
  "name": "Evening Batch 1 (Updated)",
  "maxCapacity": 35,
  "startDate": "2025-11-01T00:00:00Z",
  "courseIds": ["course123"],
  "description": "Updated React Native Bootcamp for 2026",
  "currentEnrollment": 15,
  "instituteId": "inst123"
}
```

#### `DELETE /batches/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "success": true,
  "message": "Batch deleted successfully."
}
```

### Courses Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/courses` | Create course | ADMIN, STAFF |
| `GET` | `/courses` | List `?code=RN101` | ALL |
| `GET` | `/courses/:id` | Details | ALL |
| `GET` | `/courses/:id/batches` | Batches for a course | ALL |
| `PATCH` | `/courses/:id` | Update | ADMIN, STAFF |
| `DELETE` | `/courses/:id` | Delete | ADMIN |

#### `POST /courses`
**Expected Request:**
```json
{
  "name": "React Native Development",
  "code": "RN101",
  "durationMonths": 6,
  "credits": 4,
  "feeAmount": 25000,
  "description": "Complete mobile development"
}
```
**Expected Response:**
```json
{
  "id": "course123",
  "name": "React Native Development",
  "code": "RN101",
  "durationMonths": 6,
  "credits": 4,
  "feeAmount": 25000,
  "description": "Complete mobile development",
  "instituteId": "inst123"
}
```

#### `GET /courses`
**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "id": "course123",
    "name": "React Native Development",
    "code": "RN101",
    "durationMonths": 6,
    "credits": 4,
    "feeAmount": 25000,
    "description": "Complete mobile development"
  },
  {
    "id": "course124",
    "name": "Data Science Fundamentals",
    "code": "DS101",
    "durationMonths": 8,
    "credits": 5,
    "feeAmount": 35000,
    "description": "Learn the basics of data science"
  }
]
```

#### `GET /courses/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "id": "course123",
  "name": "React Native Development",
  "code": "RN101",
  "durationMonths": 6,
  "credits": 4,
  "feeAmount": 25000,
  "description": "Complete mobile development",
  "instituteId": "inst123"
}
```

#### `GET /courses/:id/batches`
**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "id": "batch123",
    "name": "Evening Batch 1",
    "currentEnrollment": 15,
    "maxCapacity": 30
  }
]
```

#### `PATCH /courses/:id`
**Expected Request:**
```json
{
  "feeAmount": 28000,
  "description": "Updated course for complete mobile development"
}
```
**Expected Response:**
```json
{
  "id": "course123",
  "name": "React Native Development",
  "code": "RN101",
  "durationMonths": 6,
  "credits": 4,
  "feeAmount": 28000,
  "description": "Updated course for complete mobile development",
  "instituteId": "inst123"
}
```

#### `DELETE /courses/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully."
}
```

### Students Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/students` | Create profile | ADMIN, STAFF |
| `GET` | `/students` | List `?batchId=xxx` | ALL |
| `GET` | `/students/:id` | Details | ALL |
| `PATCH` | `/students/:id` | Update | ADMIN, STAFF |
| `DELETE` | `/students/:id` | Delete | ADMIN |
| `POST` | `/students/:id/batches` | Add batches | ADMIN, STAFF |
| `DELETE` | `/students/:id/batches/:batchId` | Remove batch | ADMIN |

#### `POST /students`
**Expected Request:**
```json
{
  "userId": "user123",
  "rollNumber": "STU001",
  "dateOfBirth": "2005-05-15T00:00:00Z",
  "gender": "MALE",
  "phone": "+919876543210",
  "guardianName": "Parent Name",
  "batchIds": ["batch123"],
  "individualStudy": false
}
```
**Expected Response:**
```json
{
  "id": "student123",
  "userId": "user123",
  "rollNumber": "STU001",
  "dateOfBirth": "2005-05-15T00:00:00Z",
  "gender": "MALE",
  "phone": "+919876543210",
  "guardianName": "Parent Name",
  "batchIds": ["batch123"],
  "individualStudy": false,
  "status": "PROSPECT",
  "instituteId": "inst123"
}
```

#### `GET /students`
**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "id": "student123",
    "userId": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "STU001",
    "status": "ENROLLED"
  }
]
```

#### `GET /students/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "id": "student123",
  "userId": "user123",
  "rollNumber": "STU001",
  "dateOfBirth": "2005-05-15T00:00:00Z",
  "gender": "MALE",
  "address": "123 Main St, Anytown",
  "phone": "+919876543210",
  "guardianName": "Parent Name",
  "guardianPhone": "+919876543211",
  "batchIds": ["batch123"],
  "individualStudy": false,
  "status": "ENROLLED",
  "instituteId": "inst123"
}
```

#### `PATCH /students/:id`
**Expected Request:**
```json
{
  "phone": "+919999988888",
  "address": "456 New Address, Anytown",
  "status": "ENROLLED"
}
```
**Expected Response:**
```json
{
  "id": "student123",
  "userId": "user123",
  "rollNumber": "STU001",
  "phone": "+919999988888",
  "address": "456 New Address, Anytown",
  "status": "ENROLLED"
}
```

#### `DELETE /students/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "success": true,
  "message": "Student profile deleted successfully."
}
```

#### `POST /students/:id/batches`
**Expected Request:**
```json
{
  "batchIds": ["batch124", "batch125"]
}
```
**Expected Response:**
```json
{
  "id": "student123",
  "batchIds": ["batch123", "batch124", "batch125"]
}
```

#### `DELETE /students/:id/batches/:batchId`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "success": true,
  "message": "Student removed from batch successfully."
}
```

### Staff Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/staff` | Create profile | ADMIN |
| `GET` | `/staff` | List `?department=CS` | ALL |
| `GET` | `/staff/:id` | Details | ALL |
| `PATCH` | `/staff/:id` | Update | ADMIN |
| `DELETE` | `/staff/:id` | Delete | ADMIN |

#### `POST /staff`
**Expected Request:**
```json
{
  "userId": "user456",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "qualification": "M.Tech",
  "dateOfJoining": "2025-01-15T00:00:00Z"
}
```
**Expected Response:**
```json
{
  "id": "staff123",
  "userId": "user456",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "qualification": "M.Tech",
  "dateOfJoining": "2025-01-15T00:00:00Z",
  "instituteId": "inst123"
}
```

#### `GET /staff`
**Expected Request:** (No body)

**Expected Response:**
```json
[
  {
    "id": "staff123",
    "userId": "user456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "employeeId": "EMP001",
    "department": "Computer Science"
  }
]
```

#### `GET /staff/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "id": "staff123",
  "userId": "user456",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "qualification": "M.Tech",
  "dateOfJoining": "2025-01-15T00:00:00Z",
  "salaryGrade": "A1",
  "instituteId": "inst123"
}
```

#### `PATCH /staff/:id`
**Expected Request:**
```json
{
  "department": "Information Technology",
  "salaryGrade": "A2"
}
```
**Expected Response:**
```json
{
  "id": "staff123",
  "department": "Information Technology",
  "salaryGrade": "A2"
}
```

#### `DELETE /staff/:id`
**Expected Request:** (No body)

**Expected Response:**
```json
{
  "success": true,
  "message": "Staff profile deleted successfully."
}
```

---



### Attendance Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/attendance/sessions` | Create session | TEACHER, STAFF |
| `POST` | `/attendance/sessions/:id/mark` | Bulk mark attendance | TEACHER, STAFF |
| `GET` | `/attendance/sessions` | List sessions `?date=2025-12-02` | ALL |
| `GET` | `/students/:id/attendance` | Student attendance report | ALL |
| `GET` | `/batches/:id/attendance` | Batch attendance summary | TEACHER, ADMIN |

#### `POST /attendance/sessions`
**Expected Request:**
```
{
  "batchId": "batch123",
  "courseId": "course123",
  "staffId": "staff123",
  "sessionDate": "2025-12-02T00:00:00Z",
  "sessionTime": {
    "start": "2025-12-02T10:00:00Z",
    "end": "2025-12-02T11:00:00Z"
  }
}
```

#### `POST /attendance/sessions/:id/mark`
**Expected Request:**
```
[
  {
    "studentId": "student123",
    "status": "PRESENT",
    "remarks": "On time"
  },
  {
    "studentId": "student124",
    "status": "ABSENT"
  }
]
```

### Fees Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/fee-templates` | Create fee template | ADMIN |
| `POST` | `/students/:id/fee-invoice` | Generate invoice | ADMIN, STAFF |
| `GET` | `/students/:id/fees` | Student fee summary | ALL |
| `POST` | `/invoices/:id/payments` | Record payment | ADMIN, STAFF |
| `GET` | `/reports/fees` | Fee collection report | ADMIN |

#### `POST /fee-templates`
**Expected Request:**
```
{
  "name": "Q1 Course Fee",
  "courseId": "course123",
  "components": [
    { "name": "Tuition", "amount": 15000, "dueDate": "2025-12-15" },
    { "name": "Exam Fee", "amount": 2000, "dueDate": "2025-12-15" }
  ]
}
```

#### `POST /students/:id/fee-invoice`
**Expected Request:**
```
{
  "feeTemplateId": "template123",
  "dueDate": "2025-12-15T00:00:00Z"
}
```

#### `POST /invoices/:id/payments`
**Expected Request:**
```
{
  "amount": 10000,
  "method": "UPI",
  "transactionId": "UPI123456",
  "paidBy": "John Doe"
}
```

### Uploads Module

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/uploads` | Upload file (multipart) | ALL |
| `GET` | `/uploads/:id` | Download (signed URL) | ALL |
| `GET` | `/students/:id/files` | Student documents | ALL |
| `DELETE` | `/uploads/:id` | Delete file | ADMIN, OWNER |

#### `POST /uploads` (multipart/form-data)
**Form Fields:**
```
file: (binary file)
ownerType: "STUDENT"
ownerId: "student123"
tags: "id-proof,passport"
```

---


## 📊 Key Queries & Aggregations

```
// Student attendance percentage (last 30 days)
Student.aggregate([
  { $match: { _id: studentId } },
  { $lookup: { from: 'attendancesessions', localField: '_id', foreignField: 'studentId' } }
])

// Fee collection dashboard
StudentFee.aggregate([
  { $match: { status: { $ne: 'CANCELLED' } } },
  { $group: { _id: '$status', total: { $sum: '$totalAmount' } } }
])
```

**Next: Notifications + Advanced Reports + Dashboard APIs**


## 🔐 Permissions Matrix

```
users:read         // GET /users
users:create       // POST /users, /auth/register
users:update       // PATCH /users/{id}
academic:read      // GET batches/courses/students/staff
academic:create    // POST batches/courses/students/staff
academic:update    // PATCH entities
academic:delete    // DELETE entities
student:enroll     // Batch assignments
attendance:mark      // Mark attendance
attendance:read      // View attendance records
fees:create          // Create templates/invoices
fees:read            // View fee records
fees:update          // Record payments
uploads:create       // Upload files
uploads:read         // View files
uploads:delete       // Delete files
reports:view         // Generate reports
```
