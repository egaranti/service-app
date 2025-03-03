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
            <SelectItem key={statu.label} value={statu.label}>
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
  // Ensure default statuses exist
  React.useEffect(() => {
    if (!field.status || field.status.length === 0) {
      onUpdate(field.id, {
        status: [
          { label: "Beklemede", color: "#FFC107", fixed: true },
          { label: "Bitti", color: "#4CAF50", fixed: true },
        ],
      });
    } else if (field.status.length === 1) {
      // If only one status exists, add the "Bitti" status
      onUpdate(field.id, {
        status: [
          ...field.status,
          { label: "Bitti", color: "#4CAF50", fixed: true },
        ],
      });
    } else {
      // Ensure first and last items have fixed property
      const updatedStatus = [...field.status];
      if (!updatedStatus[0].fixed) {
        updatedStatus[0] = { ...updatedStatus[0], fixed: true };
      }
      if (!updatedStatus[updatedStatus.length - 1].fixed) {
        updatedStatus[updatedStatus.length - 1] = {
          ...updatedStatus[updatedStatus.length - 1],
          fixed: true,
        };
      }
      onUpdate(field.id, { status: updatedStatus });
    }
  }, []);

  const addNewStatus = () => {
    const newOptions = [...(field.status || [])];
    // Insert new status before the last item
    newOptions.splice(newOptions.length - 1, 0, {
      label: "",
      color: "#000000",
    });
    onUpdate(field.id, { status: newOptions });
  };

  return (
    <div className="grid gap-4">
      <Label>Seçenekler</Label>
      <div className="mb-2 text-sm text-gray-500">
        İlk ("Beklemede") ve son ("Bitti") durumlar sabittir. Araya istediğiniz
        kadar durum ekleyebilirsiniz.
      </div>
      {field.status?.map((statu, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={statu.label}
            onChange={(e) => {
              const newOptions = [...field.status];
              newOptions[index] = { ...statu, label: e.target.value };
              onUpdate(field.id, { status: newOptions });
            }}
            disabled={statu.fixed}
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
            disabled={statu.fixed}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newOptions = field.status.filter((_, i) => i !== index);
              onUpdate(field.id, { status: newOptions });
            }}
            disabled={statu.fixed}
            className={statu.fixed ? "cursor-not-allowed opacity-30" : ""}
          >
            ×
          </Button>
        </div>
      ))}
      <Button onClick={addNewStatus} variant="secondaryColor">
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
        fixed: PropTypes.bool,
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
        fixed: PropTypes.bool,
      }),
    ).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
