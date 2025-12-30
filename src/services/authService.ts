import { apiService } from "./api";
import { LoginRequest, LoginResponse, ApiResponse, User } from "../types/api";

class AuthService {
  private readonly TOKEN_KEY = "healthlink_token";
  private readonly USER_KEY = "healthlink_user";

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );

    if (response.success && response.data) {
      const { user, token } = response.data;

      // Merge doctorId into user if role is doctor
      const userWithDoctorId =
        user.role === "doctor" && user.doctorProfile
          ? {
              ...user,
              doctorId: user.doctorProfile.id,
            }
          : user;

      this.setToken(token);
      this.setUser(userWithDoctorId);

      return { token, user: userWithDoctorId };
    }

    throw new Error(response.message || "Login failed");
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>("/auth/profile");

    if (response.success && response.data) {
      this.setUser(response.data);
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch profile");
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = "/";
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === "admin";
  }

  isDoctor(): boolean {
    const user = this.getUser();
    return user?.role === "doctor";
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();
