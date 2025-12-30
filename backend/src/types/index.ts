import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'doctor';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IDoctor extends Document {
  user: string;
  name: string;
  specialization: string;
  phone: string;
  experience: number;
  qualification: string;
  availability: IAvailability[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailability {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IPatient extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  description?: string;
  medicalHistory: IMedicalRecord[];
  createdAt: Date;
  updatedAt: Date;
   billingAmount?: number;
}

export interface IMedicalRecord {
  disease: string;
  diagnosis: string;
  treatment: string;
  doctorId: string;
  recordedAt: Date;
}

export interface IAppointment extends Document {
  patient: string;
  doctor: string;
  appointmentDate: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'doctor';
  doctorProfile?: {
    id: string;
    name: string;
    specialization: string;
    phone: string;
    experience: number;
    qualification: string;
    availability: IAvailability[];
    isActive: boolean;
  };
}

export interface PopulatedPatient {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  description?: string;
  medicalHistory: IMedicalRecord[];
  billingAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  toObject(): Record<string, unknown>;
}

export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'General Medicine',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'Urology'
] as const;

export type Specialization = typeof SPECIALIZATIONS[number];
