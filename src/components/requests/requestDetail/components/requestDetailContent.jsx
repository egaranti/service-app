import React from "react";

import FollowUpDataPreview from "./followUpDataPreview";

import DynamicForm from "@/components/forms/dynamicForm";

import { Handshake } from "lucide-react";

const RequestDetailContent = ({
  request,
  isEditing,
  formRef,
  handleSubmit,
  setFollowUpDialogOpen,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        {request.demandData && request.demandData.length > 0 && (
          <div>
            <h3 className="mb-4 font-medium text-gray-900">Talep Detayları</h3>
            <DynamicForm
              ref={formRef}
              fields={request.demandData}
              defaultValues={request.demandData.reduce(
                (acc, field) => ({
                  ...acc,
                  [field.label]: field.value,
                }),
                {},
              )}
              isEditing={isEditing}
              className="space-y-4"
              onSubmit={handleSubmit}
              submitButtonProps={{
                className: "hidden",
              }}
            />
          </div>
        )}

        {/* Follow-up data preview */}
        {request.followupDemandData &&
          request.followupDemandData.length > 0 && (
            <FollowUpDataPreview
              followupData={request.followupDemandData}
              request={request}
              setFollowUpDialogOpen={setFollowUpDialogOpen}
            />
          )}
        <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Hakediş Değerleri</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-green-500">
              <Handshake className="h-5 w-5 text-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailContent;
