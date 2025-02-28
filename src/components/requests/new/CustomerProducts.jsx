import { Button } from "@egaranti/components";

const CustomerProducts = ({
  customerProducts,
  onProductSelect,
  onAddNewProduct,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-medium">Müşteri Ürünleri</h3>
        <p className="mb-4 text-gray-600">
          Lütfen işlem yapmak istediğiniz ürünü seçin.
        </p>
        <div className="space-y-4">
          {customerProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
              onClick={() => onProductSelect(product)}
            >
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600">Ürün Kodu: {product.code}</p>
              {product.serialNumber && (
                <p className="text-sm text-gray-600">
                  Seri No: {product.serialNumber}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onAddNewProduct}
          >
            Farklı Ürün Seç
          </Button>
          <p className="text-center text-sm text-gray-500">
            Müşterinin işlem yapmak istediğiniz ürünü listede yoksa yeni ürün
            ekleyebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
