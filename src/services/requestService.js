import { settingsService } from "./settingsService";

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
      const response = await settingsService.getAllRequestStatuses();
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

  async updateRequestStatus(payload) {
    try {
      const response = await this.api.put(`${this.baseUrl}/${payload.id}/status`, payload);
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

  async getCustomerByPhone(phone) {
    try {
      const response = await this.api.get(`/customer/v1/${phone}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer by phone:", error);
      // Return null instead of throwing error to indicate customer doesn't exist
      return null;
    }
  }

  async getCustomerProductsById(customerId) {
    try {
      const response = await this.api.get(
        `/customer/v1/individual-customer-products/${customerId}`,
        {
          params: {
            page: 1,
            size: 50,
          },
        },
      );
      return response.data.content || [];
    } catch (error) {
      console.error("Error fetching customer products:", error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  async getMerchantProducts(searchQuery = "", page = 0, size = 10) {
    try {
      const response = await this.api.get(`product/v1`, {
        params: {
          name: searchQuery ? searchQuery.trim() : undefined,
          page,
          size,
        },
      });

      return {
        content: response.data.content || [],
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
      };
    } catch (error) {
      console.error("Error fetching merchant products:", error);
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
      };
    }
  }

  async createCustomer(customerData) {
    try {
      const response = await this.api.post("/customer/v1", customerData);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  async assignPersonnel(requestId, technicalPersonalId) {
    try {
      const response = await this.api.put(
        `${this.baseUrl}/${requestId}/assign`,
        {
          technicalPersonalId,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning personnel:", error);
      throw error;
    }
  }
}

export default new RequestService();
