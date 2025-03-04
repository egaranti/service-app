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

  // Legacy endpoints (keeping for backward compatibility)
  updateRequestSettings: async (settings) => {
    return axios.put("/settings", settings);
  },

  getRequestSettings: async () => {
    return axios.get("/settings");
  },
};
