import axios from "@/lib/axios";

class FormService {
  constructor() {
    this.api = axios;

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log("🚀 HTTP Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        });
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log("✅ HTTP Response:", {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("❌ Response Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  async getForms(filters = {}) {
    try {
      const response = await this.api.get("/api/forms", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching forms:", error);
      throw error;
    }
  }

  async getFormById(id) {
    try {
      const response = await this.api.get(`/api/forms/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching form by ID:", error);
      throw error;
    }
  }

  async createForm(formData) {
    try {
      const response = await this.api.post("/api/forms", formData);
      return response.data;
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    }
  }

  async updateForm(id, formData) {
    try {
      const response = await this.api.put(`/api/forms/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating form:", error);
      throw error;
    }
  }

  async deleteForm(id) {
    try {
      await this.api.delete(`/api/forms/${id}`);
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  }
}

export default new FormService();
