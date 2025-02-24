import axios from "@/lib/axios";

class AuthService {
  constructor() {
    this.api = axios;
    this.baseUrl = "/auth";
  }

  async generateOtp(phone) {
    try {
      const response = await this.api.post(`${this.baseUrl}/otp/generate`, {
        phone,
        countryCode: "TR",
      });
      return response.data;
    } catch (error) {
      console.error("Error generating OTP:", error);
      throw error;
    }
  }

  async login(data) {
    try {
      const response = await this.api.post(`${this.baseUrl}/otp/login`, data);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async checkAuth() {
    try {
      // Mock auth check
      return true;
    } catch (error) {
      console.error("Error checking auth:", error);
      throw error;
    }
  }
}

export default new AuthService();
