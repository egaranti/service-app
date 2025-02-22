import axios from "@/lib/axios";

class RequestService {
  constructor() {
    this.api = axios;
    this.baseUrl = "/demand/v1";
  }

  async getFilterDefinitions() {
    return Promise.resolve({
      data: [
        {
          key: "status",
          label: "Durum",
          type: "select",
          options: [
            { value: "pending", label: "Beklemede" },
            { value: "completed", label: "Tamamlandı" },
            { value: "rejected", label: "Reddedildi" },
          ],
        },
        {
          key: "createdAt",
          label: "Oluşturulma Tarihi",
          type: "date",
        },
        {
          key: "title",
          label: "Başlık",
          type: "text",
        },
        {
          key: "description",
          label: "Açıklama",
          type: "text",
        },
      ],
    });
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

  // Helper method to handle errors consistently
  handleError(error, operation) {
    console.error(`Error ${operation}:`, error);

    // If the error has a response, extract the message
    const errorMessage = error.response?.data?.message || error.message;

    // Throw a standardized error object
    throw {
      message: errorMessage,
      status: error.response?.status,
      operation,
    };
  }
}

export default new RequestService();
