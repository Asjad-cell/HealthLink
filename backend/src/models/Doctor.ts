import mongoose, { Schema } from 'mongoose';
import { IDoctor, SPECIALIZATIONS } from '../types';

const AvailabilitySchema = new Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const DoctorSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: SPECIALIZATIONS
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(0[0-9]{10}|\+92[0-9]{10})$/, 'Invalid phone number']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true,
    maxlength: [200, 'Qualification cannot exceed 200 characters']
  },
  availability: [AvailabilitySchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

DoctorSchema.index({ specialization: 1, isActive: 1 });

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
