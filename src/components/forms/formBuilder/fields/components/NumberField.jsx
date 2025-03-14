import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { BaseField } from "./BaseField";

import { settingsService } from "@/services/settingsService";

import PropTypes from "prop-types";

export const NumberFieldPreview = ({ field }) => {
  return (
    <BaseField>
      <Input
        type="number"
        id={field.id}
        placeholder={field.placeholder}
        min={field.validation?.min}
        max={field.validation?.max}
        className="w-full"
      />
    </BaseField>
  );
};

export const NumberFieldEditor = ({ field, onUpdate }) => {
  const [multiplierOptions, setMultiplierOptions] = useState([]);

  useEffect(() => {
    const fetchMultiplierVariables = async () => {
      try {
        const response = await settingsService.getAllConstants();
        setMultiplierOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch multiplier variables:", error);
      }
    };

    fetchMultiplierVariables();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor={`label-${field.id}`}>Label</Label>
        <Input
          id={`label-${field.id}`}
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
        <Input
          id={`placeholder-${field.id}`}
          value={field.placeholder}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`min-${field.id}`}>Min Value</Label>
          <Input
            id={`min-${field.id}`}
            type="number"
            value={field.validation?.min || ""}
            onChange={(e) =>
              onUpdate(field.id, {
                validation: {
                  ...field.validation,
                  min: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor={`max-${field.id}`}>Max Value</Label>
          <Input
            id={`max-${field.id}`}
            type="number"
            value={field.validation?.max || ""}
            onChange={(e) =>
              onUpdate(field.id, {
                validation: {
                  ...field.validation,
                  max: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <Label htmlFor={`multiplier-${field.id}`}>
            Çarpan
            <span className="ml-1 text-xs text-blue-600">
              Hakediş Özelliği için gerekli*
            </span>
          </Label>
          <Switch
            id={`multiplier-${field.id}`}
            checked={field.hasMultiplier}
            onCheckedChange={(checked) =>
              onUpdate(field.id, {
                hasMultiplier: checked,
                merchantConstantId: checked
                  ? field.merchantConstantId
                  : undefined,
              })
            }
          />
        </div>
        {field.hasMultiplier && (
          <Select
            value={field.merchantConstantId}
            onValueChange={(value) =>
              onUpdate(field.id, { merchantConstantId: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Değişken seçin" />
            </SelectTrigger>
            <SelectContent>
              {multiplierOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

NumberFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    validation: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
  }).isRequired,
};

NumberFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    validation: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    hasMultiplier: PropTypes.bool,
    merchantConstantId: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
