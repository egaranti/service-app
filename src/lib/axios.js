import i18n from "../i18n";

import axios from "axios";

const createAxiosInstance = (baseURL = import.meta.env.VITE_BACKEND) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const language = i18n.language;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["x-language"] = language || "tr";
    config.headers["x-individual-customer-id"] = 1;
    config.headers["x-technical-service-id"] = 1;
    config.headers["x-from"] = localStorage.getItem("user");
    return config;
  });

  return instance;
};

const api = createAxiosInstance();

export { createAxiosInstance };
export default api;
