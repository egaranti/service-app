import { Button } from "@egaranti/components";

import { useCallback, useEffect, useState } from "react";
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

import useDebounce from "@/hooks/useDebounce";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [productPagination, setProductPagination] = useState({
    page: 1,
    totalPages: 0,
  });

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
      // First check if customer exists
      const customer = await requestService.getCustomerByPhone(phoneNumber);

      if (customer) {
        // Customer exists, get their products
        const products = await requestService.getCustomerProductsById(
          customer.id,
          productPagination.page,
        );
        setCustomerProducts(products);

        // Store the customer info for later use
        setExistingCustomer({
          id: customer.id,
          name:
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
            "Müşteri",
          phone: phoneNumber,
        });

        if (products.length > 0) {
          // Customer has products
          goToStep(1.5); // Intermediate step to select a product
        } else {
          // Customer exists but has no products
          // Load merchant products for the customer to select from
          loadMerchantProducts("", 1);
          goToStep(2);
        }
      } else {
        // Customer not found
        setExistingCustomer(null);
        setCustomerProducts([]);
        // Load merchant products for the new customer
        loadMerchantProducts("", 1);
        goToStep(2);
      }
    } catch (error) {
      console.error("Error checking customer:", error);
      // Fallback to a simpler flow if there's an error
      setExistingCustomer(null);
      setCustomerProducts([]);
      loadMerchantProducts("", 1);
      goToStep(2);
    } finally {
      setLoading(false);
    }
  };

  const loadMerchantProducts = useCallback(async (query = "", page = 1) => {
    setProductSearchLoading(true);
    try {
      const pageSize = 10;

      const result = await requestService.getMerchantProducts(
        query,
        page,
        pageSize,
      );

      const mappedProducts = result.content.map((product) => ({
        id: product.id,
        name: product.name,
        code: product.model,
        brand: product.brand,
        category: product.category,
      }));

      setMerchantProducts(mappedProducts);

      setProductPagination({
        page: page,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error("Error fetching merchant products:", error);
    } finally {
      setProductSearchLoading(false);
    }
  }, []);

  // Create debounced search function
  const debouncedSearch = useDebounce((query) => {
    setSearchQuery(query);
    loadMerchantProducts(query, 1); // Reset to page 1 when search query changes
  }, 500);

  // Handle search query changes
  const handleSearchChange = (query) => {
    debouncedSearch(query);
  };

  // Handle page change
  const handlePageChange = (page) => {
    loadMerchantProducts(searchQuery, page);
  };

  const handleCustomerProductSelect = (product) => {
    setSelectedProduct({
      id: product.id,
      name: product.name || product.productName,
      code: product.model || product.productModel,
      brand: product.brand || product.productBrand,
      category: product.category || product.productCategory,
    });

    setSelectedCustomer(existingCustomer);
    goToStep(3);
  };

  const handleAddNewProduct = () => {
    loadMerchantProducts("", 1);
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
        // We no longer need to make an API call to associate product with customer
        // This will be done when creating the request
        const result = await requestService.addProductToCustomer(
          existingCustomer.id,
          productId,
        );

        setSelectedCustomer(existingCustomer);

        // Find the selected product using the productId
        const product = merchantProducts.find((p) => p.id === productId);
        setSelectedProduct(product || { id: productId });

        goToStep(3);
      } else {
        // For new customer with new product
        // Split the customer name into firstName and lastName
        const nameParts = customerName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const customerData = {
          firstName,
          lastName,
          phone: phoneNumber,
          email: "",
        };

        // First create the customer
        const customer = await requestService.createCustomer(customerData);

        if (customer?.id) {
          // Set customer info
          setSelectedCustomer({
            id: customer.id,
            name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
            phone: phoneNumber,
          });

          // No need to make an API call to associate product with customer
          // This will be done when creating the request

          // Find the selected product using the productId
          const product = merchantProducts.find((p) => p.id === productId);
          setSelectedProduct(product || { id: productId });
          goToStep(3);
        }
      }
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

      console.log("Creating request with data:", requestData);
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
            onSearchChange={handleSearchChange}
            isSearching={productSearchLoading}
            totalPages={productPagination.totalPages}
            currentPage={productPagination.page}
            onPageChange={handlePageChange}
          />
        )}

        {/* Step 3: Form */}
        {currentStep === 3 && (
          <>
            <CustomerProductSummary
              customer={selectedCustomer}
              product={selectedProduct}
            />

            {selectedForm && selectedCustomer?.id && (
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
