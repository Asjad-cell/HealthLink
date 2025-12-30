import mongoose, { Schema } from 'mongoose';
import { IPatient } from '../types';

const MedicalRecordSchema = new Schema({
  disease: {
    type: String,
    required: [true, 'Disease is required'],
    trim: true
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true
  },
  treatment: {
    type: String,
    required: [true, 'Treatment is required'],
    trim: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
});

const PatientSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  medicalHistory: [MedicalRecordSchema],
  billingAmount: { type: Number, default: 0 },
}, {
  timestamps: true
});

PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });

export default mongoose.model<IPatient>('Patient', PatientSchema);
