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

import { Plus } from "lucide-react";

const PaymentsPage = () => {
  const {
    payments,
    fetchPayments,
    updatePaymentStatus,
    updateBulkPaymentStatus,
    selectedPayments,
    togglePaymentSelection,
    toggleAllPayments,
    filters,
    setFilter,
    resetFilters,
  } = usePaymentStore();

  const [openNewPayment, setOpenNewPayment] = React.useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filters.providerId, filters.dateRange, filters.status, filters.search]);
  console.log(filters);
  // Handle payment status toggle
  const handleStatusChange = async (paymentId) => {
    const payment = payments.find((p) => p.id === paymentId);
    const newStatus = payment.status === "paid" ? "unpaid" : "paid";
    await updatePaymentStatus(paymentId, newStatus);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedPayments.length === 0) return;
    await updateBulkPaymentStatus(selectedPayments, newStatus);
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
        </div>

        <div className="flex flex-col gap-4">
          {/* Filters */}
          <PaymentFilters
            selectedProvider={filters.providerId}
            onProviderChange={(value) => setFilter("providerId", value)}
            dateRange={filters.dateRange}
            onDateRangeChange={(range) => setFilter("dateRange", range)}
            onClearFilters={resetFilters}
          />

          {/* Bulk Actions */}
          {selectedPayments.length > 0 && (
            <div className="flex items-center gap-2 rounded-md border bg-white p-4">
              <span className="text-sm font-medium">
                {selectedPayments.length} ödeme seçildi
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondaryGray"
                  onClick={() => handleBulkStatusUpdate("paid")}
                >
                  Ödendi Olarak İşaretle
                </Button>
                <Button
                  size="sm"
                  variant="secondaryGray"
                  onClick={() => handleBulkStatusUpdate("unpaid")}
                >
                  Ödenmedi Olarak İşaretle
                </Button>
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
