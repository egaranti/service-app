const CustomerProductSummary = ({ customer, product }) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-medium">Seçilen Müşteri ve Ürün</h3>
        <div className="mt-4 rounded-lg border p-4">
          <div className="mb-2">
            <span className="font-medium">Müşteri: </span>
            <span>{customer.name}</span>
          </div>
          <div>
            <span className="font-medium">Ürün: </span>
            <span>{product.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductSummary;
