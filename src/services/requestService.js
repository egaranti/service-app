import axios from "@/lib/axios";

const mockFilterDefinitions = [
  {
    key: "search",
    label: "İsim",
    type: "text",
    placeholder: "Talep ara...",
  },
  {
    key: "status",
    label: "Durum",
    type: "select",
    options: [
      { value: "pending", label: "Beklemede" },
      { value: "in_progress", label: "İşlemde" },
      { value: "completed", label: "Tamamlandı" },
      { value: "cancelled", label: "İptal Edildi" },
    ],
  },
  {
    key: "priority",
    label: "Öncelik",
    type: "select",
    options: [
      { value: "low", label: "Düşük" },
      { value: "medium", label: "Orta" },
      { value: "high", label: "Yüksek" },
      { value: "urgent", label: "Acil" },
    ],
  },
  {
    key: "department",
    label: "Departman",
    type: "select",
    options: [
      { value: "it", label: "BT" },
      { value: "hr", label: "İK" },
      { value: "finance", label: "Finans" },
      { value: "sales", label: "Satış" },
    ],
  },
  {
    key: "date",
    label: "Oluşturulma Tarihi",
    type: "date",
    placeholder: "Tarih seçin",
  },
];

const mockRequests = [
  {
    id: 1,
    name: "Sistem Erişim Talebi",
    description: "CRM sistemine erişim izni talep ediyorum",
    status: "pending",
    priority: "high",
    department: "it",
    createdAt: "2025-02-08",
  },
  {
    id: 2,
    name: "Donanım Talebi",
    description: "Yeni laptop talep ediyorum",
    status: "in_progress",
    priority: "medium",
    department: "it",
    createdAt: "2025-02-07",
  },
  {
    id: 3,
    name: "Yazılım Lisans Talebi",
    description: "IntelliJ IDEA lisansı talep ediyorum",
    status: "completed",
    priority: "low",
    department: "it",
    createdAt: "2025-02-06",
  },
  {
    id: 4,
    name: "Ofis Malzemeleri Talebi",
    description: "Yeni defter, kalem ve dosya talep ediyorum",
    status: "pending",
    priority: "low",
    department: "hr",
    createdAt: "2025-02-05",
  },
  {
    id: 5,
    name: "İzin Talebi",
    description: "2 günlük izin talebinde bulunuyorum",
    status: "in_progress",
    priority: "medium",
    department: "hr",
    createdAt: "2025-02-04",
  },
  {
    id: 6,
    name: "Seyahat Gideri Talebi",
    description: "Konferans için seyahat giderleri talep ediyorum",
    status: "completed",
    priority: "urgent",
    department: "sales",
    createdAt: "2025-02-03",
  },
  {
    id: 7,
    name: "Fatura Düzeltme Talebi",
    description: "Yanlış fatura düzenlemesi için düzeltme talep ediyorum",
    status: "cancelled",
    priority: "high",
    department: "finance",
    createdAt: "2025-02-02",
  },
];

class RequestService {
  constructor() {
    // Request interceptor
    this.api = axios;

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
  async getFilterDefinitions() {
    return Promise.resolve({ data: mockFilterDefinitions });
  }

  async getRequests(filters = {}) {
    // Filter the mock data based on the filters
    let filteredRequests = [...mockRequests];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredRequests = filteredRequests.filter(
        (request) =>
          request.name.toLowerCase().includes(searchLower) ||
          request.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters.status) {
      filteredRequests = filteredRequests.filter(
        (request) => request.status === filters.status,
      );
    }

    if (filters.priority) {
      filteredRequests = filteredRequests.filter(
        (request) => request.priority === filters.priority,
      );
    }

    if (filters.date) {
      filteredRequests = filteredRequests.filter(
        (request) => request.createdAt === filters.date,
      );
    }

    return Promise.resolve({ data: filteredRequests });
  }

  async getRequestById(id) {
    const request = mockRequests.find((r) => r.id === Number(id));

    if (!request) {
      return Promise.reject(new Error("Request not found"));
    }

    return Promise.resolve({ data: request });
  }

  async createRequest(requestData) {
    const newRequest = {
      id: mockRequests.length + 1,
      ...requestData,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockRequests.push(newRequest);

    return Promise.resolve({ data: newRequest });
  }

  async updateRequest(id, requestData) {
    const index = mockRequests.findIndex((r) => r.id === Number(id));

    if (index === -1) {
      return Promise.reject(new Error("Request not found"));
    }

    const updatedRequest = {
      ...mockRequests[index],
      ...requestData,
    };

    mockRequests[index] = updatedRequest;

    return Promise.resolve({ data: updatedRequest });
  }

  async deleteRequest(id) {
    const index = mockRequests.findIndex((r) => r.id === Number(id));

    if (index === -1) {
      return Promise.reject(new Error("Request not found"));
    }

    mockRequests.splice(index, 1);

    return Promise.resolve({ data: { success: true } });
  }
}

export default new RequestService();
