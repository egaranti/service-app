import { Label } from "@egaranti/components";
import { Button, Input, Pagination } from "@egaranti/components";

import { useEffect, useState } from "react";

const ProductSelection = ({
  phoneNumber,
  existingCustomer,
  onSubmit,
  loading,
  merchantProducts,
  onSearchChange,
  isSearching,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState(
    existingCustomer ? existingCustomer.email : "",
  );
  const [showNameInput, setShowNameInput] = useState(!existingCustomer);
  const [search, setSearch] = useState("");

  // Reset state when component mounts
  useEffect(() => {
    setSelectedProductId(null);
    if (existingCustomer) {
      setCustomerName(existingCustomer.name);
      setShowNameInput(false);
    } else {
      setCustomerName("");
      setShowNameInput(true);
    }
  }, [existingCustomer]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    onSubmit({
      customerName: customerName.trim(),
      email: email.trim(),
      productId: selectedProductId,
      isExistingCustomer: !!existingCustomer,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold">Ürün Seçimi</h3>
        <p className="text-gray-600">
          {existingCustomer
            ? `${existingCustomer.name} için yeni bir ürün seçin.`
            : `${phoneNumber} numaralı müşteri için ürün seçin.`}
        </p>
      </div>

      {showNameInput && (
        <div className="mb-6 flex flex-col">
          <div className="flex flex-col gap-2">
            <Label>Müşteri Adı Soyadı</Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ad Soyad"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Eposta</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Eposta"
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium">Ürünü Arayın</label>
        </div>
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder="Ürün adı, modeli veya markası ile arayın"
          className="mb-4"
        />
      </div>

      <div className="mb-6 max-h-80 overflow-y-auto rounded border">
        {merchantProducts.length === 0 && !isSearching ? (
          <div className="p-4 text-center text-gray-500">
            Ürün bulunamadı. Farklı bir arama yapın.
          </div>
        ) : (
          <div className="divide-y">
            {merchantProducts.map((product) => (
              <div
                key={product.id}
                className={`cursor-pointer p-3 transition hover:bg-gray-50 ${
                  selectedProductId === product.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="product"
                    checked={selectedProductId === product.id}
                    onChange={() => setSelectedProductId(product.id)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium">{product.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      {product.brand && (
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          {product.brand}
                        </span>
                      )}
                      {product.code && (
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          Model: {product.code}
                        </span>
                      )}
                      {product.category && (
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isSearching && (
              <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={10}
            onPageChange={onPageChange}
          />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={
          !selectedProductId ||
          loading ||
          (showNameInput && !customerName.trim())
        }
        className="w-full"
      >
        {loading ? "İşleniyor..." : "Devam Et"}
      </Button>
    </div>
  );
};

export default ProductSelection;
