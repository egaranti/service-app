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
    try {
      const response = await this.api.get('/api/requests/filters');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter definitions:', error);
      throw error;
    }
  }

  async getRequests(filters = {}) {
    try {
      const response = await this.api.get('/api/requests', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }

  async getRequestById(id) {
    try {
      const response = await this.api.get(`/api/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching request by ID:', error);
      throw error;
    }
  }

  async createRequest(requestData) {
    try {
      const response = await this.api.post('/api/requests', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async updateRequest(id, requestData) {
    try {
      const response = await this.api.put(`/api/requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  async deleteRequest(id) {
    try {
      await this.api.delete(`/api/requests/${id}`);
      return { data: { success: true } };
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  }
}

export default new RequestService();
