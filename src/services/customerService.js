import { createAxiosInstance } from "@/lib/axios";

class CustomerService {
  constructor() {
    this.api = createAxiosInstance(import.meta.env.VITE_CUSTOMER_BACKEND);
  }

  async searchByPhone(phone) {
    try {
      const response = await this.api.get(
        `/api/customers/search?phone=${phone}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  }
}

export default new CustomerService();
