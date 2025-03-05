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
import Breadcrumb from "@/components/ui/breadcrumb";

import useDebounce from "@/hooks/useDebounce";

/**
 * Custom hook to manage step state with history support.
 */
function useStepManager(initialStep = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepHistory, setStepHistory] = useState([initialStep]);

  const goToStep = (step) => {
    setStepHistory((prev) => [...prev, step]);
    setCurrentStep(step);
  };

  const goBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop();
      setCurrentStep(newHistory[newHistory.length - 1]);
      setStepHistory(newHistory);
    }
  };

  return { currentStep, stepHistory, goToStep, goBack };
}

/**
 * Custom hook to load and manage merchant products.
 */
function useMerchantProducts() {
  const [merchantProducts, setMerchantProducts] = useState([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [productPagination, setProductPagination] = useState({
    page: 1,
    totalPages: 0,
  });

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
      setProductPagination({ page, totalPages: result.totalPages });
    } catch (error) {
      console.error("Error fetching merchant products:", error);
    } finally {
      setProductSearchLoading(false);
    }
  }, []);

  return {
    merchantProducts,
    productSearchLoading,
    productPagination,
    loadMerchantProducts,
  };
}

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  // Step management using custom hook.
  const { currentStep, goToStep, goBack, stepHistory } = useStepManager(1);

  // Global loading & selected form
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Step 1: Customer search and products
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerProducts, setCustomerProducts] = useState([]);
  const [existingCustomer, setExistingCustomer] = useState(null);

  // Step 3: Selected customer and product for form submission
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    merchantProducts,
    productSearchLoading,
    productPagination,
    loadMerchantProducts,
  } = useMerchantProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce((query) => {
    setSearchQuery(query);
    loadMerchantProducts(query, 1);
  }, 500);

  // Load form based on query parameter type.
  useEffect(() => {
    const loadForm = async (typeId) => {
      try {
        const forms = await formService.getFormById(Number(typeId));
        setSelectedForm(forms.find((f) => f.parentFormId === null));
      } catch (error) {
        console.error("Error loading form:", error);
      }
    };
    if (type) {
      loadForm(type);
    }
  }, [type]);

  const handlePhoneSubmit = async (inputPhoneNumber) => {
    setPhoneNumber(inputPhoneNumber);
    setLoading(true);
    try {
      const customer =
        await requestService.getCustomerByPhone(inputPhoneNumber);
      if (customer) {
        const products = await requestService.getCustomerProductsById(
          customer.id,
          productPagination.page,
        );
        setCustomerProducts(products);
        setExistingCustomer({
          id: customer.id,
          name:
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
            "Müşteri",
          phone: inputPhoneNumber,
        });
        if (products.length > 0) {
          goToStep(1.5);
        } else {
          loadMerchantProducts("", 1);
          goToStep(2);
        }
      } else {
        setExistingCustomer(null);
        setCustomerProducts([]);
        loadMerchantProducts("", 1);
        goToStep(2);
      }
    } catch (error) {
      console.error("Error checking customer:", error);
      setExistingCustomer(null);
      setCustomerProducts([]);
      loadMerchantProducts("", 1);
      goToStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query) => {
    debouncedSearch(query);
  };

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
    email,
    productId,
    isExistingCustomer,
  }) => {
    setLoading(true);
    try {
      if (isExistingCustomer) {
        setSelectedCustomer(existingCustomer);
        const product = merchantProducts.find((p) => p.id === productId);
        setSelectedProduct(product || { id: productId });
        goToStep(3);
      } else {
        const nameParts = customerName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        const customerData = {
          firstName,
          lastName,
          phone: phoneNumber,
          email,
        };
        const customer = await requestService.createCustomer(customerData);
        if (customer?.id) {
          setSelectedCustomer({
            id: customer.id,
            name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
            phone: phoneNumber,
          });
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
    setLoading(true);
    try {
      const demandData = Object.entries(values).map(([label, value]) => ({
        label,
        sparePartsValue: Array.isArray(values.spareParts) ? values.spareParts : null,
        value: Array.isArray(value) ? null : value,
      }));
      const requestData = {
        formId: selectedForm.id,
        productId: selectedProduct.id,
        individualCustomerId: selectedCustomer.id,
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

        <StepIndicator currentStep={currentStep} />

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

        {currentStep === 1 && (
          <CustomerSearch onSubmit={handlePhoneSubmit} loading={loading} />
        )}

        {currentStep === 1.5 && (
          <CustomerProducts
            customerProducts={customerProducts}
            onProductSelect={handleCustomerProductSelect}
            onAddNewProduct={handleAddNewProduct}
          />
        )}

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
