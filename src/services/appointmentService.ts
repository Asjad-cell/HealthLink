import { apiService } from './api';
import {
  ApiResponse,
  BookAppointmentRequest,
  Appointment,
  DoctorProfile,
  Availability
} from '../types/api';

class AppointmentService {
  async bookAppointment(appointmentData: BookAppointmentRequest): Promise<Appointment> {
    const response = await apiService.post<ApiResponse<Appointment>>(
      '/appointments/book',
      appointmentData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to book appointment');
  }

  async getAvailableDoctors(specialization?: string): Promise<DoctorProfile[]> {
    let url = '/appointments/doctors';
    if (specialization) {
      url += `?specialization=${encodeURIComponent(specialization)}`;
    }
    
    const response = await apiService.get<ApiResponse<DoctorProfile[]>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch available doctors');
  }

  async getDoctorAvailability(
    doctorId: string, 
    date?: string
  ): Promise<{
    doctor: { id: string; name: string; specialization: string };
    availability: Availability[];
    availableSlots: string[];
  }> {
    if (!doctorId || doctorId === 'undefined' || doctorId === '') {
      throw new Error('Invalid doctor ID provided');
    }
    
    let url = `/appointments/doctors/${doctorId}/availability`;
    if (date) {
      url += `?date=${date}`;
    }
    
    const response = await apiService.get<ApiResponse<{
      doctor: { id: string; name: string; specialization: string };
      availability: Availability[];
      availableSlots: string[];
    }>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch doctor availability');
  }
}

export const appointmentService = new AppointmentService();
