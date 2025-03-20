import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@egaranti/components";

import React, { useEffect } from "react";

import { usePaymentStore } from "@/stores/usePaymentStore";

import PaymentFilters from "@/components/payments/paymentFilters";
import PaymentTable from "@/components/payments/paymentTable";

import { CheckCircle, XCircle } from "lucide-react";

const PaymentsPage = () => {
  const {
    payments,
    fetchPayments,
    updatePaymentStatus,
    selectedPayments,
    togglePaymentSelection,
    toggleAllPayments,
    filters,
    setFilter,
    resetFilters,
    fetchStats,
    stats,
  } = usePaymentStore();

  const [openNewPayment, setOpenNewPayment] = React.useState(false);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  // Handle payment status toggle
  const handleStatusChange = async (paymentId) => {
    const payment = payments.find((p) => p.id === paymentId);
    const newStatus = !payment.invoice;
    await updatePaymentStatus([paymentId], newStatus);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status) => {
    if (selectedPayments.length === 0) return;
    await updatePaymentStatus(selectedPayments, status);
  };

  // Handle select all payments
  const handleSelectAll = () => {
    toggleAllPayments(payments.map((payment) => payment.id));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setFilter("page", page);
  };

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 flex flex-col gap-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-[#111729]">
              Hakediş Yönetimi
            </h1>
            <p className="text-[#717680]">
              Bu sayfada hakediş ödemelerini yönetebilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border bg-white p-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-gray-600">Toplam Hakediş</span>
                <span className="text-lg font-bold">
                  {stats.allTotalAllowance}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Filters */}
          <PaymentFilters
            selectedProvider={filters.technicalServiceId}
            onProviderChange={(value) => setFilter("technicalServiceId", value)}
            dateRange={filters.dateRange}
            onDateRangeChange={(range) => setFilter("dateRange", range)}
            onClearFilters={resetFilters}
          />

          {/* Bulk Actions */}
          {selectedPayments.length > 0 && (
            <div className="sticky top-0 z-10 flex items-center gap-2 rounded-md border bg-white p-4">
              <span className="text-sm font-medium">
                {selectedPayments.length} ödeme seçildi
              </span>
              <div className="ml-auto flex items-center gap-4">
                <button
                  onClick={() => handleBulkStatusUpdate(true)}
                  className="flex items-center gap-2 rounded-lg border-green-300 px-1 py-2 text-green-500 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ödendi Olarak İşaretle
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(false)}
                  className="flex items-center gap-2 rounded-lg border-red-300 px-1 py-2 text-red-500 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                  Ödenmedi Olarak İşaretle
                </button>
              </div>
            </div>
          )}

          {/* Payments Table */}
          {payments?.length > 0 ? (
            <PaymentTable
              payments={payments}
              selectedPayments={selectedPayments}
              onSelectPayment={togglePaymentSelection}
              onSelectAll={handleSelectAll}
              onStatusChange={handleStatusChange}
              filters={filters}
              onPageChange={handlePageChange}
            />
          ) : (
            <div className="rounded-lg border bg-white">
              <p className="block py-4 text-center text-gray-500">
                Gösterilecek veri bulunamadı
              </p>
            </div>
          )}
        </div>
      </main>

      {/* New Payment Dialog */}
      <Dialog open={openNewPayment} onOpenChange={setOpenNewPayment}>
        <DialogContent>
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Yeni Ödeme Oluştur</h2>
            {/* Add your new payment form here */}
            <p className="text-gray-500">Ödeme formu buraya eklenecek</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
