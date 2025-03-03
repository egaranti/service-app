import axios from "@/lib/axios";

class EmployeeService {
  constructor() {
    this.api = axios;
    this.baseUrl = "/employees/v1";
  }

  async getEmployees() {
    try {
      const response = await this.api.get(`${this.baseUrl}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  }

  async getEmployeeById(id) {
    try {
      const response = await this.api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      throw error;
    }
  }
}

export default new EmployeeService();
