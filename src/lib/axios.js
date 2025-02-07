import i18n from "../i18n";

import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const language = i18n.language;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-language"] = language || "tr";

  return config;
});

export default api;
