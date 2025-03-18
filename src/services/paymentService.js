import axios from "@/lib/axios";

export const paymentService = {
  getPayments: async (params) => {
    try {
      // const response = await axios.get("/payments", { params });
      // return response.data;

      // Mock data
      const data = {
        content: [
          {
            id: 1,
            totalAllowance: 14500,
            createdAt: "2025-03-14",
            isInvoiced: false,
            technicalServiceName: "Keskin Ticaret",
            technicalServiceId: "ts1",
          },
          {
            id: 2,
            totalAllowance: 14500,
            createdAt: "2025-03-14",
            isInvoiced: true,
            technicalServiceName: "Keskin Ticaret",
            technicalServiceId: "ts1",
          },
          {
            id: 3,
            totalAllowance: 14500,
            createdAt: "2025-03-14",
            isInvoiced: false,
            technicalServiceName: "Keskin Ticaret",
            technicalServiceId: "ts1",
          },
        ],
        totalPages: 4,
        totalElements: 34,
        size: 10,
        page: 1,
        empty: false,
      };

      return data;
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
