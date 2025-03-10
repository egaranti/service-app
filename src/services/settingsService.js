import axios from "../lib/axios";

export const settingsService = {
  // Request Statuses endpoints
  getAllRequestStatuses: async () => {
    return axios.get("/status/v1/all");
  },

  addRequestStatus: async (status) => {
    // just send the status body just string
    return axios.post("/status/v1", status);
  },

  deleteRequestStatus: async (id) => {
    return axios.delete(`/status/v1/${id}`);
  },

  updateRequestStatus: async (status) => {
    return axios.put(`/status/v1`, status);
  },

  // Constants endpoints
  getAllConstants: async () => {
    return axios.get("/constants/v1/all");
  },

  addConstant: async (constant) => {
    return axios.post("/constants/v1", constant);
  },

  updateConstant: async (constant) => {
    return axios.put(`/constants/v1`, constant);
  },

  deleteConstant: async (id) => {
    return axios.delete(`/constants/v1/${id}`);
  },

  // Legacy endpoints (keeping for backward compatibility)
  updateRequestSettings: async (settings) => {
    return axios.put("/settings", settings);
  },

  getRequestSettings: async () => {
    return axios.get("/settings");
  },
};
