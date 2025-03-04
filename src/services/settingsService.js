import axios from "../lib/axios";

export const settingsService = {
  // Request Statuses endpoints
  getAllRequestStatuses: async () => {
    return axios.get("/settings/request-statuses");
  },

  addRequestStatus: async (status) => {
    return axios.post("/settings/request-statuses", status);
  },

  deleteRequestStatus: async (id) => {
    return axios.delete(`/settings/request-statuses/${id}`);
  },

  updateRequestStatuses: async (statuses) => {
    return axios.put("/settings/request-statuses", { statuses });
  },

  // Legacy endpoints (keeping for backward compatibility)
  updateRequestSettings: async (settings) => {
    return axios.put("/settings", settings);
  },

  getRequestSettings: async () => {
    return axios.get("/settings");
  },
};
