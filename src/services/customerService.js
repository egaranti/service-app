import { createAxiosInstance } from "@/lib/axios";

class CustomerService {
  constructor() {
    this.api = createAxiosInstance(import.meta.env.VITE_CUSTOMER_BACKEND);
    this.baseUrl = "/customer/v1";
  }

  async searchByPhone(phone) {
    try {
      const response = await this.api.get(
        `${this.baseUrl}/search?phone=${phone}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  }
}

export default new CustomerService();
