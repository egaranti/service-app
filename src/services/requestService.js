import axios from "@/lib/axios";

class RequestService {
  constructor() {
    this.api = axios;
  }
  async getFilterDefinitions() {
    try {
      const response = await this.api.get("/api/requests/filters");
      return response.data;
    } catch (error) {
      console.error("Error fetching filter definitions:", error);
      throw error;
    }
  }

  async getRequests(filters = {}) {
    try {
      const response = await this.api.get("/api/requests", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  }

  async getRequestById(id) {
    try {
      const response = await this.api.get(`/api/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request by ID:", error);
      throw error;
    }
  }

  async createRequest(requestData) {
    try {
      const response = await this.api.post("/api/requests", requestData);
      return response.data;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  }

  async updateRequest(id, requestData) {
    try {
      const response = await this.api.put(`/api/requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  }

  async deleteRequest(id) {
    try {
      await this.api.delete(`/api/requests/${id}`);
      return { data: { success: true } };
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  }
}

export default new RequestService();
