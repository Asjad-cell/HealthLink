import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react';
import { appointmentService } from '../../services';
import { DoctorProfile, SPECIALIZATIONS, BookAppointmentRequest } from '../../types/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { toast } from 'sonner';

interface AppointmentBookingFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  onSuccess,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientAge: '',
    patientGender: 'Male' as 'Male' | 'Female' | 'Other',
    patientDescription: '',
    specialization: '',
    doctorId: '',
    appointmentDate: '',
    timeSlot: '',
    reason: ''
  });

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const doctorList = await appointmentService.getAvailableDoctors(formData.specialization);
      setDoctors(doctorList);
      if (doctorList.length === 0) {
        toast.warning('No doctors available for this specialization', { id: 'no-doctors' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load doctors';
      toast.error(errorMessage, { id: 'doctors-error' });
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [formData.specialization]);

  const loadAvailableSlots = useCallback(async () => {
    if (!formData.doctorId || formData.doctorId === 'undefined' || formData.doctorId === '') {
      setAvailableSlots([]);
      return;
    }
    
    setLoadingSlots(true);
    try {
      const availability = await appointmentService.getDoctorAvailability(
        formData.doctorId,
        formData.appointmentDate
      );
      setAvailableSlots(availability.availableSlots || []);
      if (!availability.availableSlots || availability.availableSlots.length === 0) {
        toast.warning('No available slots for this date. Please try another date.', { id: 'no-slots' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load available slots';
      toast.error(errorMessage, { id: 'slots-error' });
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [formData.doctorId, formData.appointmentDate]);

  // Load doctors when specialization changes
  useEffect(() => {
    if (formData.specialization) {
      loadDoctors();
    } else {
      setDoctors([]);
      setFormData(prev => ({ ...prev, doctorId: '' }));
    }
  }, [formData.specialization, loadDoctors]);

  // Load available slots when doctor and date change
  useEffect(() => {
    if (formData.doctorId && formData.doctorId !== 'undefined' && formData.doctorId !== '' && formData.appointmentDate) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
      setFormData(prev => ({ ...prev, timeSlot: '' }));
    }
  }, [formData.doctorId, formData.appointmentDate, loadAvailableSlots]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const appointmentData: BookAppointmentRequest = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        patientAge: parseInt(formData.patientAge),
        patientGender: formData.patientGender,
        patientDescription: formData.patientDescription,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        reason: formData.reason
      };

      await appointmentService.bookAppointment(appointmentData);
      toast.success('Appointment booked successfully!', { id: 'appointment-success' });
      setSuccess(true);
      
      // Reset form
      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        patientAge: '',
        patientGender: 'Male',
        patientDescription: '',
        specialization: '',
        doctorId: '',
        appointmentDate: '',
        timeSlot: '',
        reason: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book appointment';
      toast.error(errorMessage, { id: 'appointment-error' });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-green-600 text-lg font-semibold mb-2">
          Appointment Booked Successfully!
        </div>
        <p className="text-green-700 mb-4">
          Your appointment has been submitted. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Book an Appointment</h2>
        <p className="text-gray-600">Schedule your visit with our healthcare professionals</p>
      </div>

      {error && (
        <ErrorMessage message={error} className="mb-6" />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone *
            </label>
            <input
              type="tel"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
            <input
              type="number"
              name="patientAge"
              value={formData.patientAge}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your age"
              min="1"
              max="150"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              name="patientGender"
              value={formData.patientGender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Selection */}
        {formData.specialization && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" className="mr-2" />
                Loading doctors...
              </div>
            ) : (
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.experience} years experience
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Date and Time Selection */}
        {formData.doctorId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time Slot *
              </label>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-2">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Loading available slots...
                </div>
              ) : availableSlots.length > 0 ? (
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              ) : formData.appointmentDate ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
                  No available slots for this date. Please try another date or contact the doctor directly.
                </div>
              ) : (
                <select
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                >
                  <option>Please select a date first</option>
                </select>
              )}
            </div>
          </div>
        )}

        {/* Reason and Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Reason for Visit *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe the reason for your appointment"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            name="patientDescription"
            value={formData.patientDescription}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Any additional information you'd like to share"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Booking Appointment...
            </>
          ) : (
            'Book Appointment'
          )}
        </button>
      </form>
    </div>
  );
};
