import api from "@/lib/axios";

export const technicalService = {
  getUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await api.get(`/technical-service`);
    return response.data;
  },

  addUser: async (userData) => {
    const response = await api.post("/technical-service", userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    await api.delete(`/technical-service/${userId}`);
  },

  bulkUpload: async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/technical-service/bulk/file/${type}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
