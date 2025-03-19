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

  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await axios.patch(`/payments/${paymentId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  updateBulkPaymentStatus: async (paymentIds, status) => {
    try {
      const response = await axios.patch("/payments/bulk/status", {
        paymentIds,
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating bulk payment status:", error);
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
