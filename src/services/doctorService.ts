import { apiService } from "./api";
import {
  ApiResponse,
  PaginationResponse,
  Availability,
  Appointment,
  Patient,
  AddMedicalRecordRequest,
  UpdateAppointmentRequest,
  DoctorStats,
} from "../types/api";

class DoctorService {
  async getAvailability(): Promise<Availability[]> {
    const response = await apiService.get<ApiResponse<Availability[]>>(
      "/api/v1/doctor/availability"
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch availability");
  }

  async updateAvailability(
    availability: Availability[]
  ): Promise<Availability[]> {
    const response = await apiService.put<ApiResponse<Availability[]>>(
      "/api/v1/doctor/availability",
      { availability }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update availability");
  }

  async getMyAppointments(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<PaginationResponse<Appointment>> {
    let url = `/api/v1/doctor/appointments?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await apiService.get<PaginationResponse<Appointment>>(url);

    if (response.success) {
      return response;
    }

    throw new Error("Failed to fetch appointments");
  }

  async updateAppointmentStatus(
    appointmentId: string,
    updateData: UpdateAppointmentRequest
  ): Promise<Appointment> {
    const response = await apiService.patch<ApiResponse<Appointment>>(
      `/api/v1/doctor/appointments/${appointmentId}`,
      updateData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update appointment");
  }

  async updateAppointmentStatusByPatient(
    patientId: string,
    updateData: UpdateAppointmentRequest
  ): Promise<Appointment[]> {
    const response = await apiService.patch<ApiResponse<Appointment[]>>(
      `/api/v1/doctor/appointments/patient/${patientId}`,
      updateData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update appointment(s)");
  }

  async getMyPatients(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResponse<Patient>> {
    const response = await apiService.get<PaginationResponse<Patient>>(
      `/api/v1/doctor/patients?page=${page}&limit=${limit}`
    );

    if (response.success) {
      return response;
    }

    throw new Error("Failed to fetch patients");
  }

  async addPatientRecord(
    patientId: string,
    recordData: AddMedicalRecordRequest
  ): Promise<Patient> {
    const response = await apiService.post<ApiResponse<Patient>>(
      `/api/v1/doctor/patients/${patientId}/records`,
      recordData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to add medical record");
  }

  async updatePatientRecord(
    patientId: string,
    recordIndex: number,
    recordData: AddMedicalRecordRequest
  ): Promise<Patient> {
    const response = await apiService.put<ApiResponse<Patient>>(
      `/api/v1/doctor/patients/${patientId}/records/${recordIndex}`,
      recordData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update medical record");
  }

  async updatePatientBilling(
    patientId: string,
    data: { billingAmount: number }
  ): Promise<Patient> {
    const response = await apiService.put<ApiResponse<Patient>>(
      `/api/v1/doctor/patients/${patientId}/billing`,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update billing amount");
  }

  async getDoctorStats(): Promise<DoctorStats> {
    const response = await apiService.get<ApiResponse<DoctorStats>>(
      "/api/v1/doctor/stats"
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch doctor stats");
  }
}

export const doctorService = new DoctorService();
