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
    return axios.get("/settings/v1/merchant-constant/all");
  },

  addConstant: async (constant) => {
    return axios.post("/settings/v1/merchant-constant", constant);
  },

  updateConstant: async (constant) => {
    return axios.put(`/settings/v1/mercahnt-constant/${constant.id}`, constant);
  },

  deleteConstant: async (id) => {
    return axios.delete(`/settings/v1/merchant-constant/${id}`);
  },

  // Legacy endpoints (keeping for backward compatibility)
  updateRequestSettings: async (settings) => {
    return axios.put("/settings", settings);
  },

  getRequestSettings: async () => {
    return axios.get("/settings");
  },
};
