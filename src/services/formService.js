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

      if (!Array.isArray(response.data)) {
        throw new Error("Expected array response from API");
      }

      const forms = response.data;
      const mainForm = forms.find((f) => f.id === parseInt(formId));

      if (!mainForm) {
        throw new Error(`Form with id ${formId} not found`);
      }

      // Get all child forms
      const childForms = forms.filter((f) => f.parentFormId === mainForm.id);

      // Sort child forms by orderKey if available
      const sortedChildForms = childForms.sort((a, b) => {
        if (a.orderKey && b.orderKey) {
          return a.orderKey.localeCompare(b.orderKey);
        }
        return 0;
      });

      return {
        ...mainForm,
        childForms: sortedChildForms,
      };
    } catch (error) {
      console.error("Error in getFormWithRelations:", error.message);
      throw new Error(`Failed to fetch form with relations: ${error.message}`);
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
      return response.data;
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
