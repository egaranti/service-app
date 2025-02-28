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
              <h4 className="font-medium">{product.name || product.productName}</h4>
              {(product.model || product.productModel) && (
                <p className="text-sm text-gray-600">
                  Model: {product.model || product.productModel}
                </p>
              )}
              {(product.brand || product.productBrand) && (
                <p className="text-sm text-gray-600">
                  Marka: {product.brand || product.productBrand}
                </p>
              )}
              {(product.category || product.productCategory) && (
                <p className="text-sm text-gray-600">
                  Kategori: {product.category || product.productCategory}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col space-y-2">
          <Button
            variant="secondaryGray"
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
