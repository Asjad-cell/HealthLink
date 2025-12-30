# HealthLink API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@healthlink.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@healthlink.com",
      "role": "admin"
    }
  }
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

---

## 👑 Admin Endpoints

### Create Doctor
```http
POST /admin/doctors
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "password123",
  "name": "Dr. John Smith",
  "specialization": "Cardiology",
  "phone": "+1234567890",
  "experience": 10,
  "qualification": "MBBS, MD Cardiology"
}
```

### Get All Doctors
```http
GET /admin/doctors?page=1&limit=10
Authorization: Bearer <admin_token>
```

### Get All Patients
```http
GET /admin/patients?page=1&limit=10
Authorization: Bearer <admin_token>
```

### Toggle Doctor Status
```http
PATCH /admin/doctors/{doctorId}/toggle-status
Authorization: Bearer <admin_token>
```

### Dashboard Statistics
```http
GET /admin/dashboard/stats
Authorization: Bearer <admin_token>
```

---

## 👨‍⚕️ Doctor Endpoints

### Update Availability
```http
PUT /doctor/availability
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "availability": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    },
    {
      "day": "Tuesday",
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    }
  ]
}
```

### Get My Appointments
```http
GET /doctor/appointments?page=1&limit=10&status=pending
Authorization: Bearer <doctor_token>
```

### Update Appointment Status
```http
PATCH /doctor/appointments/{appointmentId}
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Patient confirmed for appointment"
}
```

### Get My Patients
```http
GET /doctor/patients?page=1&limit=10
Authorization: Bearer <doctor_token>
```

### Add Patient Medical Record
```http
POST /doctor/patients/{patientId}/records
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "disease": "Hypertension",
  "diagnosis": "Stage 1 hypertension based on blood pressure readings",
  "treatment": "Prescribed ACE inhibitors, lifestyle modifications"
}
```

### Doctor Statistics
```http
GET /doctor/stats
Authorization: Bearer <doctor_token>
```

---

## 📅 Public Appointment Endpoints

### Book Appointment
```http
POST /appointments/book
Content-Type: application/json

{
  "patientName": "Jane Doe",
  "patientEmail": "jane@example.com",
  "patientPhone": "+1234567890",
  "patientAge": 30,
  "patientGender": "Female",
  "patientDescription": "Regular checkup needed",
  "doctorId": "507f1f77bcf86cd799439011",
  "appointmentDate": "2024-12-01",
  "timeSlot": "10:00",
  "reason": "Annual health checkup"
}
```

### Get Available Doctors
```http
GET /appointments/doctors?specialization=Cardiology
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dr. John Smith",
      "specialization": "Cardiology",
      "experience": 10,
      "qualification": "MBBS, MD Cardiology",
      "availability": [...]
    }
  ]
}
```

### Get Doctor Availability
```http
GET /appointments/doctors/{doctorId}/availability?date=2024-12-01
```

**Response:**
```json
{
  "success": true,
  "data": {
    "doctor": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "availability": [...],
    "availableSlots": ["09:00", "09:30", "10:00", "10:30"]
  }
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50
    }
  }
}
```

---

## 🔒 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🏥 Specializations

Available doctor specializations:
- Cardiology
- Dermatology  
- Endocrinology
- Gastroenterology
- Neurology
- Oncology
- Orthopedics
- Pediatrics
- Psychiatry
- Radiology
- General Medicine
- Gynecology
- Ophthalmology
- ENT
- Urology
