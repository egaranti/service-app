import api from "@/lib/axios";

export const userService = {
  getUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await api.get(`/service-technical-personal`);
    return response.data;
  },

  addUser: async (userData) => {
    const response = await api.post("/service-technical-personal", userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    await api.delete(`/service-technical-personal/${userId}`);
  },

  bulkUpload: async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/service-technical-personal/bulk/file/${type}`,
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
