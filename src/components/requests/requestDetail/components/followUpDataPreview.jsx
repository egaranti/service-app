import React from "react";

const FollowUpDataPreview = ({
  followupData,
  request,
  setFollowUpDialogOpen,
}) => {
  if (!followupData || followupData.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">İşlem Bilgileri</h3>
        {request.followupDemandData && (
          <button
            onClick={() => setFollowUpDialogOpen(true)}
            className="h-9 text-sm font-medium text-blue-600 hover:underline"
          >
            İşlem Ekle
          </button>
        )}
      </div>
      <div className="space-y-2">
        {followupData.map((field, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {field.label}
            </span>
            <span className="text-sm text-gray-600">
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
