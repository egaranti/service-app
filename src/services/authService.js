import axios from "@/lib/axios";

class AuthService {
  constructor() {
    this.api = axios;
  }
  // generate otp
  async generateOtp(phone) {
    const { data } = await this.api.post("/auth/generate-otp", { phone });

    return data;
  }

  async verifyOtp(phone, otp) {
    const { data } = await this.api.post("/auth/verify-otp", { phone, otp });

    return data;
  }
}

export default new AuthService();
