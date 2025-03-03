const StepIndicator = ({ currentStep }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          1
        </div>
        <div
          className={`h-1 flex-1 ${
            currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          2
        </div>
        <div
          className={`h-1 flex-1 ${
            currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          3
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span>Müşteri Seçimi</span>
        <span>Ürün Seçimi</span>
        <span>Talep Formu</span>
      </div>
    </div>
  );
};

export default StepIndicator;
