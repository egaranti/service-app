import axios from "../lib/axios";

const BASE_URL = "/spare-parts";

const SparePartsService = {
  // Get all products with pagination
  getProducts: async (searchQuery = "", page = 0, size = 10) => {
    const response = await axios.get(`product/v1`, {
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
  },

  // Get spare parts for a specific product
  getProductSpareParts: async (productId) => {
    const response = await axios.get(`${BASE_URL}/products/${productId}/parts`);
    return response.data;
  },

  // Create new spare part
  createSparePart: async (values) => {
    const response = await axios.post(`${BASE_URL}/parts`, values);
    return response.data;
  },

  // Update spare part
  updateSparePart: async (id, values) => {
    const response = await axios.put(`${BASE_URL}/parts/${id}`, values);
    return response.data;
  },

  // Delete spare part
  deleteSparePart: async (id) => {
    await axios.delete(`${BASE_URL}/parts/${id}`);
    return true;
  },
};

export default SparePartsService;
