import { Button } from "@egaranti/components";

import React from "react";

import { Loader2, Save } from "lucide-react";

const FormContainer = ({
  title,
  description,
  icon: Icon,
  children,
  onSave,
  hasChanges,
  isLoading,
}) => {
  return (
    <div className="max-w-3xl rounded-lg border bg-white p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-[#111729]">{title}</h1>
            {description && <p className="text-[#717680]">{description}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">{children}</div>

      {/* Footer */}
      {hasChanges && (
        <div className="mt-6 flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Kaydet
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormContainer;
