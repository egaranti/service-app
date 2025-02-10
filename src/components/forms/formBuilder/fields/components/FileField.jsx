import { Input, Label } from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

export const FileFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Input
        type="file"
        id={field.id}
        className="w-full"
        accept={field.accept}
      />
    </BaseField>
  );
};

export const FileFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`accept-${field.id}`}>Accepted File Types</Label>
        <Input
          id={`accept-${field.id}`}
          value={field.accept || "*/*"}
          placeholder="e.g. .pdf,.doc,.docx"
          onChange={(e) => onUpdate(field.id, { accept: e.target.value })}
        />
        <p className="text-sm text-gray-500">
          Enter file extensions separated by commas (e.g. .pdf,.doc,.docx) or
          MIME types
        </p>
      </div>
    </div>
  );
};
