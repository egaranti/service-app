import api from "./api";

export const formsService = {
  createForm: async (formData) => {
    try {
      const response = await api.post("/forms", formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateForm: async (formId, formData) => {
    try {
      const response = await api.put(`/forms/${formId}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getForms: async () => {
    try {
      const response = await api.get("/forms");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFormById: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
