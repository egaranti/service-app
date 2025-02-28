import axios from "@/lib/axios";

// Mock data for development until endpoints are available
const MOCK_CUSTOMER_PRODUCTS = [
  {
    id: 1,
    customerId: 101,
    customerName: "John Doe",
    name: "iPhone 14 Pro",
    code: "IP14PRO",
    serialNumber: "SN12345678",
  },
  {
    id: 2,
    customerId: 101,
    customerName: "John Doe",
    name: "MacBook Pro M2",
    code: "MBP-M2",
    serialNumber: "SN87654321",
  },
];

const MOCK_MERCHANT_PRODUCTS = [
  { id: "1", name: "iPhone 14", code: "IP14" },
  { id: "2", name: "iPhone 14 Pro", code: "IP14PRO" },
  { id: "3", name: "iPhone 15", code: "IP15" },
  { id: "4", name: "iPhone 15 Pro", code: "IP15PRO" },
  { id: "5", name: "MacBook Air M2", code: "MBA-M2" },
  { id: "6", name: "MacBook Pro M2", code: "MBP-M2" },
  { id: "7", name: "iPad Pro", code: "IPADPRO" },
  { id: "8", name: "Apple Watch Series 9", code: "AWS9" },
  { id: "9", name: "Samsung Galaxy S23", code: "SGS23" },
  { id: "10", name: "Samsung Galaxy S23 Ultra", code: "SGS23U" },
  { id: "11", name: "Samsung Galaxy Z Fold 5", code: "SGZF5" },
  { id: "12", name: "Samsung Galaxy Watch 6", code: "SGW6" },
  { id: "13", name: "Google Pixel 8", code: "GP8" },
  { id: "14", name: "Google Pixel 8 Pro", code: "GP8PRO" },
  { id: "15", name: "Sony PlayStation 5", code: "SPS5" },
  { id: "16", name: "Xbox Series X", code: "XBSX" },
  { id: "17", name: "Nintendo Switch OLED", code: "NSO" },
  { id: "18", name: "Dell XPS 15", code: "DXPS15" },
  { id: "19", name: "HP Spectre x360", code: "HSX360" },
  { id: "20", name: "Lenovo ThinkPad X1", code: "LTP-X1" },
];

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
      const response = await this.api.get(`${this.baseUrl}/status`);
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

  async updateDemandData(id, demandData) {
    try {
      const response = await this.api.put(`${this.baseUrl}/${id}`, demandData);
      return response.data;
    } catch (error) {
      console.error("Error updating demand data:", error);
      throw error;
    }
  }

  async getCustomerProductsByPhone(phone) {
    // Check if we're in development mode
    if (true) {
      console.log("Using mock data for getCustomerProductsByPhone");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For testing: return products for specific phone numbers, empty for others
      if (phone === "5551234567") {
        return MOCK_CUSTOMER_PRODUCTS;
      }
      return [];
    }

    try {
      const response = await this.api.get(`${this.baseUrl}/customer/products`, {
        params: { phone },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customer products:", error);
      throw error;
    }
  }

  async getMerchantProducts(searchQuery = "") {
    // Check if we're in development mode
    if (true) {
      console.log("Using mock data for getMerchantProducts");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // If search query provided, filter results
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return MOCK_MERCHANT_PRODUCTS.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            (product.code && product.code.toLowerCase().includes(query)),
        );
      }

      return MOCK_MERCHANT_PRODUCTS;
    }

    try {
      const response = await this.api.get(`${this.baseUrl}/merchant/products`, {
        params: { search: searchQuery },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching merchant products:", error);
      throw error;
    }
  }

  async createCustomerWithProduct(customerData, productId) {
    // Check if we're in development mode
    if (true) {
      console.log("Using mock data for createCustomerWithProduct");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a mock customer with the provided data
      const mockCustomer = {
        id: Math.floor(Math.random() * 1000) + 200, // Random ID between 200-1200
        ...customerData,
      };

      // Find the selected product from mock data or create a new one
      const mockProduct = MOCK_MERCHANT_PRODUCTS.find(
        (p) => p.id === productId,
      ) || {
        id: productId,
        name: `Product ${productId}`,
        code: `P${productId}`,
        serialNumber: `SN${Math.floor(Math.random() * 10000000)}`,
      };

      return {
        customer: mockCustomer,
        product: mockProduct,
      };
    }

    try {
      const response = await this.api.post(`${this.baseUrl}/customer`, {
        ...customerData,
        productId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating customer with product:", error);
      throw error;
    }
  }

  async addProductToCustomer(customerId, productId) {
    // Check if we're in development mode
    if (true) {
      console.log("Using mock data for addProductToCustomer");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find the selected product from mock data or create a new one
      const mockProduct = MOCK_MERCHANT_PRODUCTS.find(
        (p) => p.id === productId,
      ) || {
        id: productId,
        name: `Product ${productId}`,
        code: `P${productId}`,
        serialNumber: `SN${Math.floor(Math.random() * 10000000)}`,
      };

      // Add customerId to the product
      mockProduct.customerId = customerId;

      return {
        product: mockProduct,
      };
    }

    try {
      const response = await this.api.post(
        `${this.baseUrl}/customer/${customerId}/product`,
        {
          productId,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error adding product to customer:", error);
      throw error;
    }
  }
}

export default new RequestService();
