import axios from "@/lib/axios";

class TechnicalService {
  constructor() {
    this.api = axios;
    this.baseUrl = "/technical-service/v1";
  }

  async getUsers(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await this.api.get(`${this.baseUrl}/all`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async addUser(userData) {
    try {
      const response = await this.api.post(`${this.baseUrl}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await this.api.delete(`${this.baseUrl}/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async bulkUpload(file, type) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await this.api.post(
        `${this.baseUrl}/bulk/file/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading bulk file:", error);
      throw error;
    }
  }
}

export default new TechnicalService();
