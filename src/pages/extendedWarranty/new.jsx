import { useState } from "react";
import { useTranslation } from "react-i18next";

import CustomerInfoForm from "@/components/extendedWarranty/add/customerInfoForm";
import Loading from "@/components/extendedWarranty/add/loading";
import ProductInfoForm from "@/components/extendedWarranty/add/productInfoForm";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumbs";

const NewPackage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleProductInfoSubmit = (data) => {
    setLoading(true);
    setFormData((prev) => ({ ...prev, productInfo: data }));
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 2000);
  };

  const handleCustomerInfoSubmit = (data) => {
    setFormData((prev) => ({ ...prev, customerInfo: data }));
  };

  const handleCancel = () => {
    setFormData({});
    setStep(1);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#F9FAFC]">
      {loading && (
        <Loading
          title={t(
            "extendedWarrantiesPage.loading",
            "egaranti Plus Hazırlanıyor...",
          )}
        />
      )}
      {/* <Breadcrumb>
        <BreadcrumbItem link="/extended-warranties/transactions">
          {t("extendedWarrantiesPage.title")}
        </BreadcrumbItem>
        <BreadcrumbItem active>
          {t("extendedWarrantiesPage.new", "egaranti Plus Oluştur")}
        </BreadcrumbItem>
      </Breadcrumb> */}
      <div className="mx-auto mt-8 flex w-full max-w-[1100px] flex-col">
        {step === 1 ? (
          <ProductInfoForm
            onNext={handleProductInfoSubmit}
            onCancel={handleCancel}
            defaultValues={formData.productInfo}
            formData={formData}
          />
        ) : (
          <CustomerInfoForm
            onSubmit={handleCustomerInfoSubmit}
            onCancel={() => setStep(1)}
            values={formData.customerInfo}
            formData={formData}
          />
        )}
      </div>
    </main>
  );
};

export default NewPackage;
