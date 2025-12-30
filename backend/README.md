# HealthLink Backend API

A comprehensive MERN stack backend for healthcare appointment management system with role-based authentication for admins and doctors.

## Features

- **Role-based Authentication**: JWT-based auth for admins and doctors
- **Admin Portal**: Create doctors, manage all patients and appointments
- **Doctor Portal**: Manage availability, view appointments, handle patient records
- **Appointment Booking**: Public endpoint for patients to book appointments
- **Patient Management**: Comprehensive patient records with medical history
- **Professional Dashboard**: Statistics and analytics for both roles

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Validation**: Express Validator
- **Security**: Helmet, CORS, bcryptjs

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthlink?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login for admin/doctor
- `GET /api/v1/auth/profile` - Get user profile

### Admin Routes (Requires admin role)
- `POST /api/v1/admin/doctors` - Create new doctor
- `GET /api/v1/admin/doctors` - Get all doctors
- `GET /api/v1/admin/patients` - Get all patients
- `PATCH /api/v1/admin/doctors/:id/toggle-status` - Activate/deactivate doctor
- `GET /api/v1/admin/dashboard/stats` - Get dashboard statistics

### Doctor Routes (Requires doctor role)
- `PUT /api/v1/doctor/availability` - Update availability schedule
- `GET /api/v1/doctor/appointments` - Get doctor's appointments
- `PATCH /api/v1/doctor/appointments/:id` - Update appointment status
- `GET /api/v1/doctor/patients` - Get doctor's patients
- `POST /api/v1/doctor/patients/:id/records` - Add medical record
- `GET /api/v1/doctor/stats` - Get doctor statistics

### Public Appointment Routes
- `POST /api/v1/appointments/book` - Book appointment (public)
- `GET /api/v1/appointments/doctors` - Get available doctors
- `GET /api/v1/appointments/doctors/:id/availability` - Get doctor availability

## Default Admin Account

After first run, a default admin account is created:
- **Email**: admin@healthlink.com
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

## Data Models

### User
- Email, password, role (admin/doctor)
- Encrypted passwords with bcrypt

### Doctor
- Personal info, specialization, experience
- Availability schedule by day/time
- Active status management

### Patient
- Contact info, demographics
- Medical history with doctor records
- Auto-created during appointment booking

### Appointment
- Patient-doctor relationship
- Date/time scheduling with conflict prevention
- Status tracking (pending/confirmed/completed/cancelled)

## Specializations Supported

- Cardiology, Dermatology, Endocrinology
- Gastroenterology, Neurology, Oncology
- Orthopedics, Pediatrics, Psychiatry
- Radiology, General Medicine, Gynecology
- Ophthalmology, ENT, Urology

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- MongoDB injection protection

## Error Handling

- Comprehensive error middleware
- Validation error responses
- Development vs production error details
- Graceful server shutdown handling
