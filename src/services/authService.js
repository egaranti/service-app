import axios from "@/lib/axios";

class AuthService {
  constructor() {
    this.api = axios;
  }

  async login(credentials) {
    // Mock login response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (credentials.username === "123456") {
      return {
        message: "OTP required for verification",
      };
    }

    throw new Error("Invalid credentials");
  }

  async generateOtp(phone) {
    // Mock OTP generation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Mock: OTP sent to ${phone}`);
    return { success: true, message: "OTP sent successfully" };
  }

  async verifyOtp(phone, otp) {
    // Mock OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (otp === "123456") {
      return {
        jwtToken: "Bearer mockToken123",
        user: {
          id: 1,
          username: phone,
          name: "Mock User",
        },
      };
    }

    throw new Error("Invalid OTP");
  }

  async checkAuth() {
    // Mock auth check
    const token = localStorage.getItem("token");
    if (token) {
      return {
        id: 1,
        username: "123456",
        name: "Mock User",
      };
    }
    return null;
  }
}

export default new AuthService();
