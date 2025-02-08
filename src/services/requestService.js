import axios from "@/lib/axios";

const transformFields = (fields) => {
  if (!fields) return [];

  return fields.map((field) => ({
    id: field.id,
    value: field.value,
    type: field.type,
    label: field.label,
    required: field.required,
    options: field.options,
    placeholder: field.placeholder,
    validation: field.validation,
  }));
};

const transformRequestData = (data) => {
  return {
    ...data,
    fields: transformFields(data.fields),
    followUpFields: transformFields(data.followUpFields),
  };
};

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
    id: "request_3",
    formId: "form_1",
    status: "in_progress",
    priority: "low",
    createdAt: "08.02.2025 09:00",
    updatedAt: "08.02.2025 16:20",
    formData: {
      title: "Yeni Yazıcı Kurulumu",
      description:
        "Departmanımıza yeni gelen yazıcının kurulumunu talep ediyorum.",
      category: "hardware",
      urgency: "low",
    },
    followUpData: {
      resolution: "Yazıcı kurulumu yapıldı, test aşamasında.",
      status: "pending",
      notes: "Sürücü güncellemeleri yapılıyor, yarın tekrar kontrol edilecek.",
    },
    fields: [
      {
        name: "title",
        label: "Talep Başlığı",
        type: "text",
        placeholder: "Talebinizin kısa başlığını girin",
        required: true,
      },
      {
        name: "description",
        label: "Talep Detayı",
        type: "textarea",
        placeholder: "Talebinizin detaylarını açıklayın",
        required: true,
      },
      {
        name: "category",
        label: "Kategori",
        type: "select",
        placeholder: "Talep kategorisini seçin",
        required: true,
        options: [
          { value: "hardware", label: "Donanım" },
          { value: "software", label: "Yazılım" },
          { value: "network", label: "Ağ" },
          { value: "access", label: "Erişim" },
        ],
      },
      {
        name: "urgency",
        label: "Aciliyet",
        type: "select",
        placeholder: "Talebin aciliyetini seçin",
        required: true,
        options: [
          { value: "low", label: "Düşük" },
          { value: "medium", label: "Orta" },
          { value: "high", label: "Yüksek" },
        ],
      },
    ],
  },
  {
    id: "request_1",
    formId: "form_1",
    status: "resolved",
    priority: "medium",
    createdAt: "08.02.2025 14:30",
    updatedAt: "08.02.2025 15:45",
    formData: {
      title: "Laptop Performans Sorunu",
      description:
        "Laptop'um son günlerde çok yavaş çalışıyor ve bazen donuyor.",
      category: "hardware",
      urgency: "medium",
    },
    followUpData: {
      resolution:
        "Disk temizliği yapıldı ve gereksiz programlar kaldırıldı. Ayrıca RAM yükseltmesi önerildi.",
      status: "resolved",
      notes: "Kullanıcıya disk bakımı konusunda bilgilendirme yapıldı.",
    },
    fields: [
      {
        name: "title",
        label: "Talep Başlığı",
        type: "text",
        placeholder: "Talebinizin kısa başlığını girin",
        required: true,
      },
      {
        name: "description",
        label: "Talep Detayı",
        type: "textarea",
        placeholder: "Talebinizin detaylarını açıklayın",
        required: true,
      },
      {
        name: "category",
        label: "Kategori",
        type: "select",
        placeholder: "Talep kategorisini seçin",
        required: true,
        options: [
          { value: "hardware", label: "Donanım" },
          { value: "software", label: "Yazılım" },
          { value: "network", label: "Ağ" },
          { value: "access", label: "Erişim" },
        ],
      },
      {
        name: "urgency",
        label: "Aciliyet",
        type: "select",
        placeholder: "Talebin aciliyetini seçin",
        required: true,
        options: [
          { value: "low", label: "Düşük" },
          { value: "medium", label: "Orta" },
          { value: "high", label: "Yüksek" },
        ],
      },
    ],
  },
];

class RequestService {
  constructor() {
    this.api = axios;

    this.api.interceptors.request.use(
      (config) => {
        if (config.data) {
          config.data = transformRequestData(config.data);
        }

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
    const request = mockRequests.find((r) => r.id === id);

    if (!request) {
      return Promise.reject(new Error("Request not found"));
    }

    return Promise.resolve({ data: request });
  }

  async createRequest(requestData) {
    const transformedData = transformRequestData(requestData);
    const newRequest = {
      id: mockRequests.length + 1,
      ...transformedData,
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
