import axios from "@/lib/axios";

const PARTS_API_URL = `/spare-parts/v1`;

export const SparePartsService = {
  getAll: async () => {
    const response = await axios.get(PARTS_API_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${PARTS_API_URL}/${id}`);
    return response.data;
  },

  create: async (part) => {
    const response = await axios.post(PARTS_API_URL, part);
    return response.data;
  },

  update: async (id, part) => {
    const response = await axios.put(`${PARTS_API_URL}/${id}`, part);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${PARTS_API_URL}/${id}`);
    return response.data;
  },

  addSubpart: async (id, subpart) => {
    const response = await axios.post(
      `${PARTS_API_URL}/${id}/subparts`,
      subpart,
    );
    return response.data;
  },
};
