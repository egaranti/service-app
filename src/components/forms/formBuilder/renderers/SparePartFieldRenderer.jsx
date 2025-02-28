import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tag,
} from "@egaranti/components";

import { useEffect, useState } from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import { useSparePartsStore } from "@/stores/useSparePartsStore";

import PropTypes from "prop-types";

const SparePartFieldRenderer = ({
  field,
  value = [],
  onChange,
  error,
  touched,
  disabled,
  isEditing,
}) => {
  const { spareParts, loading, fetchSpareParts } = useSparePartsStore();
  const [selectedItems, setSelectedItems] = useState(value || []);

  useEffect(() => {
    fetchSpareParts();
  }, [fetchSpareParts]);

  useEffect(() => {
    setSelectedItems(value || []);
  }, [value]);

  const handleSelectChange = (partName) => {
    let newSelectedItems;

    if (!selectedItems.includes(partName)) {
      newSelectedItems = [...selectedItems, partName];
    } else {
      newSelectedItems = selectedItems.filter((name) => name !== partName);
    }

    setSelectedItems(newSelectedItems);
    onChange(newSelectedItems);
  };

  const isOptionSelected = (partName) => {
    return selectedItems.includes(partName);
  };

  return (
    <BaseFieldRenderer field={field} error={error} touched={touched}>
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondaryColor"
              className="w-full justify-between"
              disabled={disabled || loading}
            >
              Yedek parça seçimi için tıkla
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full min-w-[200px] bg-white"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel>Yedek Parçalar</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {loading ? (
              <div className="p-2 text-center">Yükleniyor...</div>
            ) : spareParts.length === 0 ? (
              <div className="p-2 text-center">Yedek parça bulunamadı</div>
            ) : (
              spareParts.map((part) => (
                <DropdownMenuCheckboxItem
                  key={part.id}
                  onSelect={(e) => e.preventDefault()}
                  checked={isOptionSelected(part.name)}
                  onCheckedChange={() => handleSelectChange(part.name)}
                >
                  {part.name}
                </DropdownMenuCheckboxItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedItems.length > 0 && (
          <div className="mt-4 flex max-w-full flex-wrap gap-1 overflow-hidden">
            {selectedItems.map((partName) => (
              <Tag size="sm" key={partName} className="max-w-[100px] truncate">
                {partName}
              </Tag>
            ))}
          </div>
        )}
        {!isEditing && (
          <div className="mt-4 flex max-w-full flex-wrap gap-1 overflow-hidden">
            {field.spareParts.map((partName) => (
              <Tag size="sm" key={partName} className="max-w-[100px] truncate">
                {partName}
              </Tag>
            ))}
          </div>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </BaseFieldRenderer>
  );
};

SparePartFieldRenderer.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  touched: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SparePartFieldRenderer;
