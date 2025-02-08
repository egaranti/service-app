import axios from "@/lib/axios";

const filterDefinitions = [
  {
    key: "search",
    label: "İsim",
    type: "text",
    placeholder: "Form adı ara...",
  },
  {
    key: "status",
    label: "Durum",
    type: "select",
    options: [
      { value: "active", label: "Aktif" },
      { value: "draft", label: "Taslak" },
    ],
  },
  {
    key: "dateRange",
    label: "Oluşturulma Tarihi",
    type: "daterange",
    placeholder: "Tarih seçin",
  },
];

const mockForms = [
  {
    id: 1,
    name: "Customer Feedback Form",
    description: "Collect feedback from customers about our services",
    createdAt: "01.02.2025",
    status: "active",
    submissions: 145,
  },
  {
    id: 2,
    name: "Service Request Form",
    description: "Allow customers to request technical service",
    createdAt: "28.01.2025",
    status: "draft",
    submissions: 0,
  },
];

class FormService {
  constructor() {
    this.api = axios;

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log("🚀 HTTP Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        });
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log("✅ HTTP Response:", {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("❌ Response Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  async getForms(filters = {}) {
    // Simulate API call with filtering
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = {
          content: [],
          filters: filterDefinitions,
        };

        let filteredForms = [...mockForms];

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredForms = filteredForms.filter(
            (form) =>
              form.name.toLowerCase().includes(searchLower) ||
              form.description.toLowerCase().includes(searchLower),
          );
        }

        if (filters.status) {
          filteredForms = filteredForms.filter(
            (form) => form.status === filters.status,
          );
        }

        response.content = filteredForms;
        resolve({ data: response });
      }, 500);
    });
  }

  async getFormById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const form = mockForms.find((f) => f.id === id);
        if (form) {
          resolve({ data: form });
        } else {
          reject(new Error("Form not found"));
        }
      }, 300);
    });
  }

  async createForm(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newForm = {
          id: mockForms.length + 1,
          ...formData,
          createdAt: new Date().toLocaleDateString("tr-TR"),
          submissions: 0,
        };
        mockForms.push(newForm);
        resolve({ data: newForm });
      }, 300);
    });
  }

  async updateForm(id, formData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockForms.findIndex((f) => f.id === id);
        if (index !== -1) {
          mockForms[index] = { ...mockForms[index], ...formData };
          resolve({ data: mockForms[index] });
        } else {
          reject(new Error("Form not found"));
        }
      }, 300);
    });
  }
}

export default new FormService();
