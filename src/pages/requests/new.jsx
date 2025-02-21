import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import formService from "@/services/formService";
import requestService from "@/services/requestService";

import CustomerSearch from "@/components/customer/CustomerSearch";
import DynamicForm from "@/components/forms/DynamicForm";
import Breadcrumb from "@/components/shared/breadcrumb";

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadForm = async (type) => {
      try {
        const forms = await formService.getFormById(Number(type));
        setSelectedForm(forms[0]);
      } catch (error) {
        console.error("Error loading form:", error);
      }
    };
    if (type) {
      loadForm(type);
    }
  }, []);

  const handleSubmit = async (values) => {
    if (!selectedForm) {
      return;
    }

    try {
      setLoading(true);
      // if (!selectedCustomer) {
      //   throw new Error("Lütfen müşteri seçiniz");
      // }

      const requestData = {
        formId: selectedForm.id,
        formData: values,
        customerId: selectedCustomer?.id,
        customerPhone: selectedCustomer?.phone,
      };

      await requestService.createRequest(requestData);

      navigate("/requests");
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Talepler", path: "/requests" },
    { label: "Yeni Talep", path: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111729]">
            Yeni Talep Oluştur
          </h1>
          <p className="mt-2 text-gray-600">
            Lütfen talep formunu doldurun ve gönderin.
          </p>
        </div>
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-medium">Müşteri Seçimi</h3>
            <p className="mb-4 text-gray-600">
              Lütfen müşteri telefon numarası ile arama yapın.
            </p>
            <CustomerSearch onCustomerSelect={setSelectedCustomer} />
          </div>
          {selectedCustomer && (
            <div className="mt-4 rounded-md bg-gray-50 p-4">
              <h4 className="font-medium">Seçili Müşteri:</h4>
              <p className="text-gray-700">{selectedCustomer.name}</p>
              <p className="text-gray-600">{selectedCustomer.phone}</p>
              {selectedCustomer.email && (
                <p className="text-gray-600">{selectedCustomer.email}</p>
              )}
            </div>
          )}
        </div>

        {selectedForm && (
          <div className="formBox">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium">{selectedForm.name}</h3>
              <p className="text-gray-600">{selectedForm.description}</p>
            </div>
            <DynamicForm
              fields={selectedForm.fields}
              onSubmit={handleSubmit}
              isEditing={true}
              submitButtonProps={{
                className: "mt-6 w-full",
                disabled: loading,
                children: loading ? "Gönderiliyor..." : "Talebi Gönder",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRequestPage;
