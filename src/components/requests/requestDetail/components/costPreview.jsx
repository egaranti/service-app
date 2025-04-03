import { useEffect, useState } from "react";

import { settingsService } from "../../../../services/settingsService";

import { Handshake, Loader2 } from "lucide-react";

const CostPreview = ({ request }) => {
  const [itemCosts, setItemCosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCosts = async () => {
      setIsLoading(true);
      try {
        const allItems = [
          ...(request?.demandData || []),
          ...(request?.followupDemandData || []),
        ];
        const costsPromises = allItems
          .filter((item) => item.merchantConstantId || item.cost)
          .map(async (item) => {
            if (item.merchantConstantId) {
              const response = await settingsService.getConstantById(
                item.merchantConstantId,
              );

              return {
                label: item.label,
                constantName: response.data?.name || "Bilinmiyor",
                constantValue: response.data?.value || 0,
                quantity: item.value || 0,
                totalCost: (response.data?.value || 0) * (item.value || 0),
              };
            }
            return {
              label: item.label,
              cost: item.cost,
              totalCost: item.cost,
            };
          });

        const costs = (await Promise.all(costsPromises)).filter(Boolean);
        setItemCosts(costs);
      } catch (error) {
        console.error("Error fetching costs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (request) {
      fetchCosts();
    }
  }, [request]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="mb-4 font-medium text-gray-900">Hakediş Değerleri</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
          <Handshake className="h-5 w-5 text-white" />
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-4 text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm">Yükleniyor...</span>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {itemCosts.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-800">
                    {item.constantName ? (
                      <span className="rounded-md bg-gray-50 px-2 py-1">
                        {item.constantName} (
                        {formatCurrency(item.constantValue)}) x {item.quantity}
                      </span>
                    ) : (
                      <span className="rounded-md bg-gray-50 px-2 py-1">
                        Sabit Ücret
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-gray-900">
              <span className="font-medium">Toplam Hakediş</span>
              <span className="text-base font-semibold">
                {formatCurrency(request?.totalAllowance)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CostPreview;
