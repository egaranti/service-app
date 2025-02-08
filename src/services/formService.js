import axios from "@/lib/axios";

const filterDefinitions = [
  {
    key: "search",
    label: "İsim",
    type: "text",
    placeholder: "Form adı ara...",
  },
  {
    key: "dateRange",
    label: "Oluşturulma Tarihi",
    type: "daterange",
    placeholder: "Tarih seçin",
  },
  {
    key: "category",
    label: "Kategori",
    type: "select",
    options: [
      { value: "feedback", label: "Geri Bildirim" },
      { value: "request", label: "Talep" },
      { value: "survey", label: "Anket" },
      { value: "application", label: "Başvuru" },
    ],
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
    id: "form_1",
    name: "IT Destek Talep Formu",
    description: "BT departmanından destek talep etmek için kullanılan form",
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
    id: "form_2",
    name: "Erişim Talep Formu",
    description: "Sistem ve uygulama erişim talepleri için kullanılan form",
    fields: [
      {
        name: "title",
        label: "Talep Başlığı",
        type: "text",
        placeholder: "Erişim talebinizin başlığını girin",
        required: true,
      },
      {
        name: "system",
        label: "Sistem",
        type: "select",
        placeholder: "Erişim istediğiniz sistemi seçin",
        required: true,
        options: [
          { value: "crm", label: "CRM" },
          { value: "erp", label: "ERP" },
          { value: "mail", label: "E-posta" },
          { value: "vpn", label: "VPN" },
        ],
      },
      {
        name: "reason",
        label: "Talep Nedeni",
        type: "textarea",
        placeholder: "Erişim talebinizin nedenini açıklayın",
        required: true,
      },
      {
        name: "duration",
        label: "Erişim Süresi",
        type: "select",
        placeholder: "Erişim süresini seçin",
        required: true,
        options: [
          { value: "temporary", label: "Geçici (1 ay)" },
          { value: "permanent", label: "Kalıcı" },
        ],
      },
    ],
  },
  {
    id: "form_3",
    name: "Erişim Talep Formu",
    description: "Sistem ve uygulama erişim talepleri için kullanılan form",
    category: "feedback",
    status: "active",
    submissions: 145,
    createdBy: "Ahmet Yılmaz",
    fields: [
      {
        id: "field_1",
        type: "text",
        label: "Ad Soyad",
        key: "fullName",
        required: true,
        placeholder: "Adınızı ve soyadınızı girin",
        order: 0,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        id: "field_2",
        type: "text",
        label: "E-posta Adresi",
        key: "email",
        required: true,
        placeholder: "E-posta adresinizi girin",
        order: 1,
        validation: {
          pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        },
      },
      {
        id: "field_3",
        type: "radio",
        label: "Hizmetlerimizden ne kadar memnunsunuz?",
        key: "satisfaction",
        required: true,
        options: [
          { label: "Çok Memnunum", value: "5" },
          { label: "Memnunum", value: "4" },
          { label: "Kararsızım", value: "3" },
          { label: "Memnun Değilim", value: "2" },
          { label: "Hiç Memnun Değilim", value: "1" },
        ],
        order: 2,
      },
      {
        id: "field_4",
        type: "textarea",
        label: "Ek Yorumlarınız",
        key: "comments",
        required: false,
        placeholder: "Lütfen ek görüşlerinizi paylaşın",
        order: 3,
        validation: {
          maxLength: 1000,
        },
      },
    ],
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

        // Text search in name and description
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredForms = filteredForms.filter(
            (form) =>
              form.name.toLowerCase().includes(searchLower) ||
              form.description.toLowerCase().includes(searchLower),
          );
        }

        // Status filter
        if (filters.status) {
          filteredForms = filteredForms.filter(
            (form) => form.status === filters.status,
          );
        }

        // Category filter
        if (filters.category) {
          filteredForms = filteredForms.filter(
            (form) => form.category === filters.category,
          );
        }

        // Date range filter
        if (filters.dateRange?.start && filters.dateRange?.end) {
          const start = new Date(filters.dateRange.start);
          const end = new Date(filters.dateRange.end);
          filteredForms = filteredForms.filter((form) => {
            const createdAt = new Date(
              form.createdAt.split(".").reverse().join("-"),
            );
            return createdAt >= start && createdAt <= end;
          });
        }

        response.content = filteredForms;
        resolve({ data: response });
      }, 500);
    });
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
        const form = mockForms[0];
        if (form) {
          resolve({ data: form });
        } else {
          reject(new Error("Form bulunamadı"));
        }
      }, 300);
    });
  }

  async createForm(formData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validate required fields
          if (!formData.name) {
            throw new Error("Form adı zorunludur");
          }

          const newForm = {
            id: mockForms.length + 1,
            ...formData,
            createdAt: new Date().toLocaleDateString("tr-TR"),
            updatedAt: new Date().toLocaleDateString("tr-TR"),
            submissions: 0,
            status: formData.status || "draft",
          };

          mockForms.push(newForm);
          resolve({ data: newForm });
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  async updateForm(id, formData) {
    return new Promise((resolve, reject) => {
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
        try {
          const index = mockForms.findIndex((f) => f.id === id);
          if (index === -1) {
            throw new Error("Form bulunamadı");
          }

          // Validate required fields if they are being updated
          if (formData.name === "") {
            throw new Error("Form adı zorunludur");
          }

          const updatedForm = {
            ...mockForms[index],
            ...formData,
            updatedAt: new Date().toLocaleDateString("tr-TR"),
          };

          mockForms[index] = updatedForm;
          resolve({ data: updatedForm });
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  async deleteForm(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockForms.findIndex((f) => f.id === id);
        if (index === -1) {
          reject(new Error("Form bulunamadı"));
        } else {
          mockForms.splice(index, 1);
          resolve({ data: { message: "Form başarıyla silindi" } });
        }
      }, 300);
    });
  }

  async deleteForm(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockForms.findIndex((f) => f.id === id);
        if (index === -1) {
          reject(new Error("Form bulunamadı"));
          return;
        }

        mockForms.splice(index, 1);
        resolve({ data: { message: "Form başarıyla silindi" } });
      }, 300);
    });
  }
}

export default new FormService();
