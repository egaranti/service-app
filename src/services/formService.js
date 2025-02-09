import axios from "@/lib/axios";

class FormService {
  constructor() {
    this.api = axios;
  }

  async getForms(filters = {}) {
    try {
      const response = await this.api.get("/forms", { params: filters });
      return response;
    } catch (error) {
      console.error("Error fetching forms:", error);
      throw error;
    }
  }

  async getFormById(id) {
    try {
      const response = await this.api.get(`/forms/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching form by ID:", error);
      throw error;
    }
  }

  async createForm(formData) {
    try {
      const response = await this.api.post("/forms", formData);
      return response.data;
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    }
  }

  async updateForm(id, formData) {
    try {
      const response = await this.api.put(`/forms/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating form:", error);
      throw error;
    }
  }

  async deleteForm(id) {
    try {
      await this.api.delete(`/forms/${id}`);
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  }
}

export default new FormService();
