import axios from "../lib/axios";

const BASE_URL = "/spare-parts/v1";

const SparePartsService = {
  // Bulk create spare parts
  bulkCreateSpareParts: async (file, productId) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "xlsx" && fileExtension !== "csv") {
      throw new Error("Unsupported file format. Please use .xlsx or .csv");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/bulk/file/${productId}/${fileExtension}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Get all products with pagination
  getProducts: async (searchQuery = "", page = 0, size = 10) => {
    const response = await axios.get(`/product/v1`, {
      params: {
        query: searchQuery,
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
    const response = await axios.get(`${BASE_URL}/${productId}`);
    return response.data;
  },

  // Create new spare part
  createSparePart: async (values) => {
    const response = await axios.post(`${BASE_URL}`, values);
    return response.data;
  },

  // Update spare part
  updateSparePart: async (id, values) => {
    const response = await axios.put(`${BASE_URL}/${id}`, values);
    return response.data;
  },

  // Delete spare part
  deleteSparePart: async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  },
};

export default SparePartsService;
