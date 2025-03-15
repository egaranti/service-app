import { useEffect, useState } from "react";

import { settingsService } from "../../../../services/settingsService";

import { Handshake } from "lucide-react";

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
          .filter(
            (item) => item.merchantConstantId || item.spareParts || item.cost,
          )
          .map(async (item) => {
            if (item.merchantConstantId) {
              const response = await settingsService.getConstantById(
                item.merchantConstantId,
              );
              return {
                label: item.label,
                value: item.value,
                cost: response.data?.value || 0, // Ensure to access the correct property
                type: "constant",
              };
            } else if (item.spareParts) {
              const sparePartsCost = item.spareParts.reduce(
                (sum, part) => sum + (Number(part.price) || 0),
                0,
              );
              return {
                label: item.label,
                value: item.spareParts.map((part) => part.name).join(", "),
                cost: sparePartsCost,
                type: "sparePart",
              };
            } else if (item.cost) {
              return {
                label: item.label,
                value: item.value,
                cost: Number(item.cost) || 0,
                type: "direct",
              };
            }
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

  const calculatedTotal = itemCosts.reduce(
    (sum, item) => sum + (Number(item.cost) || 0),
    0,
  );

  return (
    <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Hakediş Değerleri</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-green-500">
          <Handshake className="h-5 w-5 text-gray-200" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Yükleniyor...</div>
      ) : (
        <>
          {itemCosts.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-900">
                  {item.cost} TL
                </span>
              </div>
              {item.type === "sparePart" && (
                <div className="mt-1 text-sm text-gray-500">{item.value}</div>
              )}
            </div>
          ))}

          <div className="mt-4 border-t border-green-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Toplam Hakediş</span>
              <span className="font-medium text-gray-900">
                {calculatedTotal} TL
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CostPreview;
