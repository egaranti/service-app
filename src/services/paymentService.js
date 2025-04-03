import axios from "@/lib/axios";

export const paymentService = {
  getPayments: async (params) => {
    try {
      const response = await axios.get("/demand/v1/all", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  },

  getPaymentsStats: async (params) => {
    try {
      const response = await axios.get("/demand/v1/invoice-info", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payments stats:", error);
      throw error;
    }
  },

  updatePaymentStatus: async (ids, status) => {
    try {
      const response = await axios.put(`/demand/v1/invoice`, {
        demandIds: ids,
        invoice: status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await axios.post("/payments", paymentData);
      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },
};
