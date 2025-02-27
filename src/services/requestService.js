import axios from "@/lib/axios";

class RequestService {
  constructor() {
    this.api = axios;
    this.baseUrl = "/demand/v1";
  }

  async getRequests(filters = {}) {
    try {
      const response = await this.api.get(`${this.baseUrl}/all`, {
        params: filters,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  }

  async getFilterDefinitions() {
    try {
      const response = await this.api.get(`${this.baseUrl}/status`);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter definitions:", error);
      throw error;
    }
  }

  async getRequestById(id) {
    try {
      const response = await this.api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request by ID:", error);
      throw error;
    }
  }

  async createRequest(requestData) {
    try {
      const response = await this.api.post(`${this.baseUrl}`, requestData);
      return response.data;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  }

  async updateRequest(id, requestData) {
    try {
      const response = await this.api.put(`${this.baseUrl}/${id}`, requestData);
      return response.data;
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  }

  async updateDemandData(id, demandData) {
    try {
      const response = await this.api.put(`${this.baseUrl}/${id}`, demandData);
      return response.data;
    } catch (error) {
      console.error("Error updating demand data:", error);
      throw error;
    }
  }
}

export default new RequestService();
