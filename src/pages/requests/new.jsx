import { Button } from "@egaranti/components";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import formService from "@/services/formService";
import requestService from "@/services/requestService";

import DynamicForm from "@/components/forms/dynamicForm";
import {
  CustomerProducts,
  CustomerProductSummary,
  CustomerSearch,
  ProductSelection,
  StepIndicator,
} from "@/components/requests/new";
import Breadcrumb from "@/components/shared/breadcrumb";

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [stepHistory, setStepHistory] = useState([1]);

  // Step 1: Phone number and customer products
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerProducts, setCustomerProducts] = useState([]);
  const [existingCustomer, setExistingCustomer] = useState(null);

  // Step 2: Merchant products
  const [merchantProducts, setMerchantProducts] = useState([]);

  // Step 3: Customer and product data for form submission
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadForm = async (type) => {
      try {
        const forms = await formService.getFormById(Number(type));
        setSelectedForm(forms.find((f) => f.orderKey === `form_1`));
      } catch (error) {
        console.error("Error loading form:", error);
      }
    };
    if (type) {
      loadForm(type);
    }
  }, [type]);

  // Function to update step with history tracking
  const goToStep = (step) => {
    setStepHistory((prev) => [...prev, step]);
    setCurrentStep(step);
  };

  // Function to go back to previous step
  const goBack = () => {
    if (stepHistory.length > 1) {
      // Remove current step from history
      const newHistory = [...stepHistory];
      newHistory.pop();

      // Set the previous step as current
      const previousStep = newHistory[newHistory.length - 1];
      setCurrentStep(previousStep);
      setStepHistory(newHistory);
    }
  };

  const handlePhoneSubmit = async (phoneNumber) => {
    setPhoneNumber(phoneNumber);
    setLoading(true);

    try {
      const products =
        await requestService.getCustomerProductsByPhone(phoneNumber);
      setCustomerProducts(products);

      if (products.length > 0) {
        // Customer found with products
        // Store the customer info for later use
        setExistingCustomer({
          id: products[0].customerId,
          name: products[0].customerName || "Müşteri",
          phone: phoneNumber,
        });
        goToStep(1.5); // Intermediate step to select a product
      } else {
        // Customer not found or has no products
        setExistingCustomer(null);
        loadMerchantProducts();
        goToStep(2);
      }
    } catch (error) {
      console.error("Error fetching customer products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMerchantProducts = async (search = "") => {
    try {
      const products = await requestService.getMerchantProducts(search);
      setMerchantProducts(products);
    } catch (error) {
      console.error("Error fetching merchant products:", error);
    }
  };

  const handleCustomerProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedCustomer({
      id: product.customerId,
      phone: phoneNumber,
      name: existingCustomer?.name || product.customerName || "Müşteri",
    });
    goToStep(3);
  };

  const handleAddNewProduct = () => {
    loadMerchantProducts();
    goToStep(2);
  };

  const handleProductSelectionSubmit = async ({
    customerName,
    productId,
    isExistingCustomer,
  }) => {
    setLoading(true);

    try {
      // For existing customer with new product
      if (isExistingCustomer) {
        // Associate product with existing customer
        const result = await requestService.addProductToCustomer(
          existingCustomer.id,
          productId,
        );

        setSelectedCustomer(existingCustomer);
        setSelectedProduct(result.product);
      } else {
        // For new customer with new product
        const customerData = {
          name: customerName,
          phone: phoneNumber,
        };

        const result = await requestService.createCustomerWithProduct(
          customerData,
          productId,
        );

        setSelectedCustomer(result.customer);
        setSelectedProduct(result.product);
      }
      goToStep(3);
    } catch (error) {
      console.error("Error processing customer with product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    if (!selectedForm || !selectedCustomer || !selectedProduct) {
      return;
    }

    try {
      setLoading(true);
      // Transform form values into demandData array format
      const demandData = Object.entries(values).map(([label, value]) => ({
        label,
        value: typeof value === "string" ? [value] : value,
      }));

      const requestData = {
        formId: selectedForm.id,
        productId: selectedProduct.id,
        customerId: selectedCustomer.id,
        demandData,
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

  // Check if back button should be shown (not on first step and history has more than 1 item)
  const showBackButton = stepHistory.length > 1;

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

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Back Button */}
        {showBackButton && (
          <div className="mb-4">
            <Button
              variant="secondaryGray"
              onClick={goBack}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Geri Dön
            </Button>
          </div>
        )}

        {/* Step 1: Customer Search */}
        {currentStep === 1 && (
          <CustomerSearch onSubmit={handlePhoneSubmit} loading={loading} />
        )}

        {/* Step 1.5: Customer Products */}
        {currentStep === 1.5 && (
          <CustomerProducts
            customerProducts={customerProducts}
            onProductSelect={handleCustomerProductSelect}
            onAddNewProduct={handleAddNewProduct}
          />
        )}

        {/* Step 2: Product Selection */}
        {currentStep === 2 && (
          <ProductSelection
            phoneNumber={phoneNumber}
            existingCustomer={existingCustomer}
            onSubmit={handleProductSelectionSubmit}
            loading={loading}
            merchantProducts={merchantProducts}
            onSearchChange={loadMerchantProducts}
          />
        )}

        {/* Step 3: Form */}
        {currentStep === 3 && (
          <>
            <CustomerProductSummary
              customer={selectedCustomer}
              product={selectedProduct}
            />

            {selectedForm && (
              <div className="formBox rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-medium">
                    {selectedForm.name}
                  </h3>
                  <p className="text-gray-600">{selectedForm.description}</p>
                </div>
                <DynamicForm
                  fields={selectedForm.fields}
                  onSubmit={handleFormSubmit}
                  isEditing={true}
                  submitButtonProps={{
                    className: "mt-6 w-full",
                    disabled: loading,
                    children: loading ? "Gönderiliyor..." : "Talebi Gönder",
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewRequestPage;
