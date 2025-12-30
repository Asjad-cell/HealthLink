# HealthLink MERN Stack Setup Guide

## 🏗️ Project Structure

```
HealthLink/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── dashboard/   # Admin & Doctor dashboards
│   │   ├── components/
│   │   └── auth/
│   └── package.json
├── backend/                  # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & validation
│   │   └── utils/           # Helper functions
│   └── package.json
└── README.md
```

## 🚀 Backend Setup (Completed)

### ✅ Features Implemented

1. **Authentication System**
   - JWT-based authentication
   - Role-based access (Admin, Doctor)
   - Secure password hashing with bcrypt

2. **Admin Portal**
   - Create doctor accounts
   - View all doctors and patients
   - Dashboard statistics
   - Toggle doctor active status

3. **Doctor Portal**
   - Login and profile management
   - Set availability schedules
   - View and manage appointments
   - Patient records management
   - Add medical history

4. **Appointment System**
   - Public appointment booking
   - Doctor availability checking
   - Time slot conflict prevention
   - Status tracking (pending/confirmed/completed/cancelled)

5. **Patient Management**
   - Auto-creation during booking
   - Medical history tracking
   - Doctor-patient relationships

### 📁 Backend Structure Created

```
backend/
├── src/
│   ├── models/
│   │   ├── User.ts           # Admin/Doctor users
│   │   ├── Doctor.ts         # Doctor profiles
│   │   ├── Patient.ts        # Patient records
│   │   ├── Appointment.ts    # Appointment system
│   │   └── index.ts          # Model exports
│   ├── controllers/
│   │   ├── authController.ts      # Login/profile
│   │   ├── adminController.ts     # Admin functions
│   │   ├── doctorController.ts    # Doctor functions
│   │   └── appointmentController.ts # Booking system
│   ├── routes/
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── admin.ts          # Admin endpoints
│   │   ├── doctor.ts         # Doctor endpoints
│   │   ├── appointment.ts    # Public booking
│   │   └── index.ts          # Route aggregation
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   ├── validation.ts     # Input validation
│   │   └── errorHandler.ts   # Error handling
│   ├── utils/
│   │   ├── jwt.ts            # Token utilities
│   │   ├── seedAdmin.ts      # Default admin
│   │   └── testSetup.ts      # Setup verification
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── server.ts             # Express server
├── package.json
├── tsconfig.json
├── nodemon.json
├── .env.example
├── .gitignore
├── README.md
└── API_DOCUMENTATION.md
```

## 🔧 Next Steps

### 1. Database Setup
```bash
# Update backend/.env with your MongoDB Atlas URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthlink?retryWrites=true&w=majority
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

### 3. Test API Endpoints
- Health check: `GET http://localhost:5000/api/v1/health`
- Default admin login: `POST http://localhost:5000/api/v1/auth/login`
  ```json
  {
    "email": "admin@healthlink.com",
    "password": "admin123"
  }
  ```

### 4. Frontend Integration
Update your React components to connect to the backend:

```typescript
// Example API service
const API_BASE = 'http://localhost:5000/api/v1';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};
```

## 🔐 Authentication Flow

1. **Admin Login** → Create doctors → Manage system
2. **Doctor Login** → Set availability → Manage appointments
3. **Patient Booking** → Public form → Auto-create patient record

## 📊 Database Schema

### Users Collection
- `email`, `password`, `role` (admin/doctor)
- Auto-hashed passwords

### Doctors Collection
- Personal info, specialization, experience
- Availability schedule (day/time slots)
- Active status

### Patients Collection
- Contact info, demographics
- Medical history array
- Auto-created during booking

### Appointments Collection
- Patient-doctor relationship
- Date/time with conflict prevention
- Status tracking and notes

## 🎯 API Endpoints Summary

### Public Routes
- `POST /api/v1/appointments/book` - Book appointment
- `GET /api/v1/appointments/doctors` - List doctors
- `GET /api/v1/appointments/doctors/:id/availability` - Check availability

### Auth Routes
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get profile (protected)

### Admin Routes (Admin only)
- `POST /api/v1/admin/doctors` - Create doctor
- `GET /api/v1/admin/doctors` - List all doctors
- `GET /api/v1/admin/patients` - List all patients
- `GET /api/v1/admin/dashboard/stats` - Dashboard stats

### Doctor Routes (Doctor only)
- `PUT /api/v1/doctor/availability` - Set schedule
- `GET /api/v1/doctor/appointments` - My appointments
- `GET /api/v1/doctor/patients` - My patients
- `POST /api/v1/doctor/patients/:id/records` - Add medical record

## 🔒 Security Features

- JWT tokens stored in localStorage (frontend)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- MongoDB injection protection

## 📱 Frontend Integration Points

Your existing dashboard components should connect to:

1. **Admin Dashboard** → `/api/v1/admin/*` endpoints
2. **Doctor Dashboard** → `/api/v1/doctor/*` endpoints  
3. **Appointment Booking** → `/api/v1/appointments/book`
4. **Doctor Listing** → `/api/v1/appointments/doctors`

The backend is now complete and ready for frontend integration!
