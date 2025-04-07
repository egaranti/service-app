import axios from "axios";

const createAxiosInstance = (baseURL = import.meta.env.VITE_BACKEND) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["x-from"] = localStorage.getItem("user");
    return config;
  });

  return instance;
};

const api = createAxiosInstance();

export { createAxiosInstance };
export default api;
