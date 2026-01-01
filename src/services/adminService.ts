import { apiService } from "./api";
import {
  ApiResponse,
  PaginationResponse,
  CreateDoctorRequest,
  User,
  DoctorProfile,
  Patient,
  AdminStats,
  Appointment,
} from "../types/api";

class AdminService {
  async createDoctor(
    doctorData: CreateDoctorRequest
  ): Promise<{ user: User; doctor: DoctorProfile; token: string }> {
    const response = await apiService.post<
      ApiResponse<{ user: User; doctor: DoctorProfile; token: string }>
    >("/api/v1/admin/doctors", doctorData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create doctor");
  }

  async getAllDoctors(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResponse<DoctorProfile>> {
    const response = await apiService.get<PaginationResponse<DoctorProfile>>(
      `/api/v1/admin/doctors?page=${page}&limit=${limit}`
    );

    if (response.success) {
      return response;
    }

    throw new Error("Failed to fetch doctors");
  }

  async getAllPatients(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResponse<Patient>> {
    const response = await apiService.get<PaginationResponse<Patient>>(
      `/api/v1/admin/patients?page=${page}&limit=${limit}`
    );

    if (response.success) {
      return response;
    }

    throw new Error("Failed to fetch patients");
  }

  // Inside AdminService class
  async updatePatient(
    patientId: string,
    patientData: Partial<Patient>
  ): Promise<Patient> {
    const response = await apiService.patch<ApiResponse<Patient>>(
      `/api/v1/admin/patients/${patientId}`,
      patientData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update patient");
  }

  async toggleDoctorStatus(doctorId: string): Promise<DoctorProfile> {
    const response = await apiService.patch<ApiResponse<DoctorProfile>>(
      `/api/v1/admin/doctors/${doctorId}/toggle-status`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to toggle doctor status");
  }

  async updateDoctor(
    doctorId: string,
    doctorData: Omit<CreateDoctorRequest, 'password'> & { password?: string }
  ): Promise<DoctorProfile> {
    const response = await apiService.patch<ApiResponse<DoctorProfile>>(
      `/api/v1/admin/doctors/${doctorId}`,
      doctorData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update doctor");
  }

  // Delete doctor
  async deleteDoctor(doctorId: string): Promise<{ message: string }> {
    const response = await apiService.delete<ApiResponse<{ message: string }>>(
      `/api/v1/admin/doctors/${doctorId}`
    );

    if (response.success) {
      return response.data || { message: response.message || "Doctor deleted successfully" };
    }

    throw new Error(response.message || "Failed to delete doctor");
  }

  async getAllAppointments(): Promise<{ appointments: Appointment[] }> {
    const response = await apiService.get<
      ApiResponse<{ appointments: Appointment[] }>
    >("/api/v1/admin/appointments");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch appointments");
  }

  // Fetch appointments for a specific doctor
  async getAppointmentsByDoctor(
    doctorId: string
  ): Promise<{ appointments: Appointment[] }> {
    if (!doctorId || doctorId === 'undefined' || doctorId === '') {
      throw new Error('Invalid doctor ID provided');
    }
    
    const response = await apiService.get<
      ApiResponse<{ appointments: Appointment[] }>
    >(`/api/v1/appointments/doctor/${doctorId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(
      response.message || "Failed to fetch appointments for doctor"
    );
  }

  async getDashboardStats(): Promise<{
    stats: AdminStats;
    recentAppointments: Appointment[];
  }> {
    const response = await apiService.get<
      ApiResponse<{ stats: AdminStats; recentAppointments: Appointment[] }>
    >("/api/v1/admin/dashboard/stats");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch dashboard stats");
  }
}

export const adminService = new AdminService();
