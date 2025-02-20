import axios from "@/lib/axios";

class AuthService {
  constructor() {
    this.api = axios;
  }

  async generateOtp(phone) {
    const response = await this.api.post("/auth/v1/otp/generate", {
      phone,
      countryCode: "TR",
    });
    return response.data;
  }

  async login(data) {
    const response = await this.api.post("/auth/v1/otp/login", data);
    return response.data;
  }

  async checkAuth() {
    // Mock auth check

    return true;
  }
}

export default new AuthService();
