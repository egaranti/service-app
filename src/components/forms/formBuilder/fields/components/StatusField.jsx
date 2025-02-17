import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tag,
} from "@egaranti/components";

import React from "react";

import { BaseField } from "./BaseField";

import PropTypes from "prop-types";

const isLightColor = (color) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export const StatusFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Select className="w-full" defaultValue={field.status?.[0]?.label}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={field.placeholder || ""} />
        </SelectTrigger>
        <SelectContent>
          {field.status?.map((statu) => (
            <SelectItem key={option.label} value={statu.label}>
              <Tag
                className="px-2 py-1"
                style={{
                  backgroundColor: statu.color,
                  color: isLightColor(statu.color) ? "#000" : "#fff",
                }}
              >
                {statu.label}
              </Tag>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField>
  );
};

export const StatusFieldEditor = ({ field, onUpdate }) => {
  return (
    <div className="grid gap-4">
      <Label>Seçenekler</Label>
      {field.status?.map((statu, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={statu.label}
            onChange={(e) => {
              const newOptions = [...field.status];
              newOptions[index] = { ...statu, label: e.target.value };
              onUpdate(field.id, { status: newOptions });
            }}
          />
          <input
            type="color"
            value={statu.color}
            className="h-8 w-8 cursor-pointer rounded"
            onChange={(e) => {
              const newOptions = [...field.status];
              newOptions[index] = { ...statu, color: e.target.value };
              onUpdate(field.id, { status: newOptions });
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newOptions = field.status.filter((_, i) => i !== index);
              onUpdate(field.id, { status: newOptions });
            }}
          >
            ×
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          const newOptions = [...(field.status || [])];
          newOptions.push({ label: "", color: "#000000" });
          onUpdate(field.id, { status: newOptions });
        }}
        variant="secondaryColor"
      >
        Yeni Durum Ekle
      </Button>
    </div>
  );
};

StatusFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    status: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

StatusFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
