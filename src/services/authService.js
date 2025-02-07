import axios from "@/lib/axios";

class AuthService {
  constructor() {
    this.api = axios;
  }

  async login(user) {
    const { data } = await this.api.post("/login", user);

    return data;
  }

  async ideaSoftLogin(user) {
    const { data } = await this.api.post("/idea-soft/login", user);

    return data;
  }

  async register(user) {
    const { data } = await this.api.post("/register", user);

    return data;
  }

  async uploadLogo(data) {
    const formData = new FormData();
    formData.append("multipartFile", data);

    const { data: response } = await this.api.post(
      "/merchants/logo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response;
  }

  async updateMerchant(data) {
    const { data: response } = await this.api.put("/merchants", data);

    return response;
  }

  async deleteLogo() {
    const { data } = await this.api.delete("/merchants/logo");
    return data;
  }

  async getLogo() {
    try {
      const { data } = await this.api.get("/merchants/logo");

      return data.logoUrl;
    } catch (error) {
      console.error("Error fetching logo:", error);
      return null;
    }
  }

  async checkAuth() {
    try {
      const { data } = await this.api.get("/merchant-users/info");

      return data;
    } catch (err) {
      return null;
    }
  }

  async forgotPassword(email) {
    const { data } = await this.api.post("/auth/forgot-password", email);

    return data;
  }

  async resetPassword(bodyObj) {
    const { data } = await this.api.post("/auth/reset/password", bodyObj);

    return data;
  }

  async getRegions() {
    const { data } = await this.api.get("/regions");

    return data;
  }

  async getCountries(regionId) {
    const { data } = await this.api.get(`/countries?regionValue=${regionId}`);

    return data;
  }

  async changePassword(bodyObj) {
    const { data } = await this.api.put(
      "/merchant-users/change-password",
      bodyObj,
    );

    return data;
  }
}

class MockAuthService {
  async login(user) {
    // Simulate a successful login response with a token
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ jwtToken: `Bearer mockTokenFor${user.storeCode}` });
      }, 1000); // Simulate network delay
    });
  }

  // Other methods can be mocked similarly if needed
}

export default new MockAuthService();
