import axios from "@/lib/axios";

export const paymentService = {
  getPayments: async (params) => {
    // const response = await axios.get("/payments");
    const data = {
      content: [
        {
          id: 1,
          totalAllowance: 14500,
          createdAt: "2025-03-14",
          isInvoiced: false,
          technicalServiceName: "Keskin Ticaret",
        },
        {
          id: 2,
          totalAllowance: 14500,
          createdAt: "2025-03-14",
          isInvoiced: true,
          technicalServiceName: "Keskin Ticaret",
        },
        {
          id: 3,
          totalAllowance: 14500,
          createdAt: "2025-03-14",
          isInvoiced: false,
          technicalServiceName: "Keskin Ticaret",
        },
      ],
      totalPages: 4,
      totalElements: 34,
      size: 10,
      page: 1,
      empty: false,
    };

    return data;
  },

  updatePaymentStatus: async (paymentId, status) => {
    const response = await axios.put(`/payments/${paymentId}/status`, {
      status,
    });
    return response.data;
  },

  updateBulkPaymentStatus: async (paymentIds, status) => {
    const response = await axios.put(`/payments/bulk-status`, {
      paymentIds,
      status,
    });
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await axios.post("/payments", paymentData);
    return response.data;
  },
};
