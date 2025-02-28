import { Button, Input } from "@egaranti/components";

import { useEffect, useState } from "react";

const ProductSelection = ({
  phoneNumber,
  existingCustomer,
  onSubmit,
  loading,
  merchantProducts,
  onSearchChange,
}) => {
  const [newCustomerName, setNewCustomerName] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedMerchantProduct, setSelectedMerchantProduct] = useState(null);
  const [filteredMerchantProducts, setFilteredMerchantProducts] = useState([]);

  useEffect(() => {
    // Filter products based on search query
    if (merchantProducts.length > 0) {
      const filtered = productSearchQuery
        ? merchantProducts.filter((product) =>
            product.name
              .toLowerCase()
              .includes(productSearchQuery.toLowerCase()),
          )
        : merchantProducts;
      setFilteredMerchantProducts(filtered);
    }
  }, [merchantProducts, productSearchQuery]);

  useEffect(() => {
    // Trigger search when query changes
    const timer = setTimeout(() => {
      onSearchChange(productSearchQuery);
    }, 300); // Debounce to avoid too many API calls while typing

    return () => clearTimeout(timer);
  }, [productSearchQuery, onSearchChange]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for new customer
    if (!existingCustomer && !newCustomerName.trim()) {
      return;
    }

    if (!selectedMerchantProduct) {
      return;
    }

    onSubmit({
      customerName: newCustomerName,
      productId: selectedMerchantProduct.id,
      isExistingCustomer: !!existingCustomer,
    });
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-medium">
          {existingCustomer ? "Ürün Seçimi" : "Yeni Müşteri Bilgileri"}
        </h3>
        <p className="mb-4 text-gray-600">
          {existingCustomer
            ? "Lütfen işlem yapmak istediğiniz ürünü seçin."
            : "Lütfen müşteri bilgilerini ve ürün seçimini tamamlayın."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input label="Telefon Numarası" value={phoneNumber} disabled />
          </div>

          {existingCustomer ? (
            <div>
              <label className="mb-1 block text-sm font-medium">Ad Soyad</label>
              <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-3">
                {existingCustomer.name}
              </div>
            </div>
          ) : (
            <div>
              <Input
                label="Ad Soyad"
                placeholder="Müşteri adı soyadı"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Ürün Seçimi
            </label>
            <div className="mb-2">
              <Input
                placeholder="Ürün ara..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto rounded border">
              {filteredMerchantProducts.length > 0 ? (
                filteredMerchantProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`cursor-pointer border-b p-3 last:border-b-0 hover:bg-gray-50 ${
                      selectedMerchantProduct?.id === product.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedMerchantProduct(product)}
                  >
                    <div className="font-medium">{product.name}</div>
                    {product.code && (
                      <div className="text-sm text-gray-500">
                        Kod: {product.code}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  {productSearchQuery
                    ? "Ürün bulunamadı"
                    : "Ürün listesi yükleniyor..."}
                </div>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              loading ||
              (!existingCustomer && !newCustomerName.trim()) ||
              !selectedMerchantProduct
            }
            className="w-full"
          >
            {loading ? <p>loading...</p> : null}
            Devam Et
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductSelection;
