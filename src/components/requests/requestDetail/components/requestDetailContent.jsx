import React from "react";

import FollowUpDataPreview from "./followUpDataPreview";

import DynamicForm from "@/components/forms/dynamicForm";

const RequestDetailContent = ({
  request,
  isEditing,
  formRef,
  handleSubmit,
  setFollowUpDialogOpen,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-6">
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
      </div>
    </div>
  );
};

export default RequestDetailContent;
