import axios from "@/lib/axios";

class FormService {
  constructor() {
    this.api = axios;
    this.baseUrl = "/form/v1";
  }

  async getAllForms(merchantId) {
    try {
      const response = await this.api.get(`${this.baseUrl}/all`, {
        headers: {
          "x-merchant-id": merchantId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all forms:", error);
      throw error;
    }
  }

  async getFormById(formId, merchantId) {
    try {
      const response = await this.api.get(`${this.baseUrl}/${formId}`, {
        headers: {
          "x-merchant-id": merchantId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching form by ID:", error);
      throw error;
    }
  }

  async getFormWithRelations(formId, merchantId) {
    try {
      const response = await this.api.get(`${this.baseUrl}/${formId}`, {
        headers: {
          "x-merchant-id": merchantId,
        },
      });
      
      // Assume response.data is an array of forms
      const forms = response.data;
      const mainForm = forms.find(f => f.id === formId);
      const followUps = forms.filter(f => f.parentFormId === formId);
      
      return {
        ...mainForm,
        followUpForms: followUps
      };
    } catch (error) {
      console.error("Error fetching form with relations:", error);
      throw error;
    }
  }

  async createForm(formData, merchantId) {
    try {
      const response = await this.api.post(this.baseUrl, formData, {
        headers: {
          "x-merchant-id": merchantId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    }
  }

  async updateForm(formId, formData, merchantId) {
    try {
      const response = await this.api.put(
        `${this.baseUrl}/${formId}`,
        formData,
        {
          headers: {
            "x-merchant-id": merchantId,
          },
        },
      );
      return response;
    } catch (error) {
      console.error("Error updating form:", error);
      throw error;
    }
  }

  async deleteForm(formId, merchantId) {
    try {
      await this.api.delete(`${this.baseUrl}/${formId}`, {
        headers: {
          "x-merchant-id": merchantId,
        },
      });
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  }
}

export default new FormService();
