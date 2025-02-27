import axios from "@/lib/axios";

const SPARE_PARTS_URL = `/spare-parts/v1`;

export const SparePartsService = {
  getAll: async (params) => {
    const response = await axios.get(`${SPARE_PARTS_URL}/all`, { params });
    return response.data;
  },

  create: async (sparePart) => {
    const response = await axios.post(SPARE_PARTS_URL, sparePart);
    return response.data;
  },

  update: async (id, sparePart) => {
    const response = await axios.put(`${SPARE_PARTS_URL}/${id}`, sparePart);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${SPARE_PARTS_URL}/${id}`);
    return response.data;
  },

  bulkCreate: async (spareParts) => {
    const response = await axios.post(`${SPARE_PARTS_URL}/bulk`, spareParts);
    return response.data;
  },

  updateStock: async (id, quantity) => {
    const response = await axios.patch(`${SPARE_PARTS_URL}/${id}/stock`, {
      quantity,
    });
    return response.data;
  },
};
