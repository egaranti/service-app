import React from "react";

import { SquareChartGantt } from "lucide-react";

const FollowUpDataPreview = ({
  followupData,
  request,
  setFollowUpDialogOpen,
}) => {
  if (!followupData || followupData.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="mb-4 font-medium text-gray-900">İşlem Bilgileri</h3>{" "}
        {request.followupDemandData && (
          <button
            onClick={() => setFollowUpDialogOpen(true)}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            İşlem Ekle
          </button>
        )}
      </div>
      <div className="space-y-3">
        {followupData.map((field, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {field.label}
            </span>
            <span className="mt-1 text-sm text-gray-600">
              {(field.value ?? field.spareParts) ? (
                Array.isArray(field.value ?? field.spareParts) ? (
                  (field.value ?? field.spareParts).join(", ")
                ) : (
                  (field.value ?? field.spareParts).toString()
                )
              ) : (
                <span className="text-gray-400">Belirtilmemiş</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUpDataPreview;
