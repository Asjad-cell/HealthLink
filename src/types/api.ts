// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationResponse<T> {
  success: boolean;
  data: {
    items?: T[];
    doctors?: T[];
    patients?: T[];
    appointments?: T[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

// User & Authentication Types
export interface User {
  id?: string;

  email: string;
  role: "admin" | "doctor";
  doctorProfile?: DoctorProfile;
  doctorId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Doctor Types
export interface DoctorProfile {
  id: string;
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  experience: number;
  qualification: string;
  availability: Availability[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
  _id: string;
  email: string;
};
}

export interface CreateDoctorRequest {
  email: string;
  password: string;
  name: string;
  specialization: string;
  phone: string;
  experience: number;
  qualification: string;
}

export interface Availability {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Patient Types
export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  description?: string;
  medicalHistory: MedicalRecord[];
  createdAt: string;
  updatedAt: string;
  // Additional fields for doctor's patient view
  latestAppointmentReason?: string;
  latestAppointmentDate?: string;
  totalAppointments?: number;
  appointmentReasons?: string[];
  billingAmount?: number
}

export interface MedicalRecord {
  disease: string;
  diagnosis: string;
  treatment: string;
  doctorId: string;
  recordedAt: string;
}

export interface AddMedicalRecordRequest {
  disease: string;
  diagnosis: string;
  treatment: string;
  billingAmount?: number;
}

// Appointment Types
export interface Appointment {
  _id: string;
  patient: Patient;
  doctor: DoctorProfile;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookAppointmentRequest {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientDescription?: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
}

export interface UpdateAppointmentRequest {
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

// Dashboard Stats Types
export interface AdminStats {
  totalDoctors: number;
  activeDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface DoctorStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalPatients: number;
  todayAppointments: number;
}

// Specializations
export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "General Medicine",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Urology",
] as const;

export type Specialization = (typeof SPECIALIZATIONS)[number];
