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

import SparePartsService from "@/services/sparePartsService";

import PropTypes from "prop-types";

const SparePartFieldRenderer = ({
  field,
  value = [],
  onChange,
  error,
  touched,
  disabled,
  isEditing,
  productId,
}) => {
  const [selectedItems, setSelectedItems] = useState(value || []);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedItems(value || []);
    fetchSpareParts();
  }, [value, productId]);

  const fetchSpareParts = async () => {
    setLoading(true);
    SparePartsService.getProductSpareParts(productId)
      .then((spareParts) => {
        setSpareParts(spareParts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching spare parts:", error);
        setLoading(false);
      });
  };

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
          className="max-h-64 w-full max-w-36 overflow-y-auto bg-white"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel>Yedek Parçalar</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {loading ? (
            <div className="p-2 text-center">Yükleniyor...</div>
          ) : spareParts.length === 0 ? (
            <div className="p-2 text-center">Yedek parça bulunamadı</div>
          ) : (
            spareParts?.map((part) => (
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
          {selectedItems?.map((partName) => (
            <Tag size="sm" key={partName} className="max-w-[100px] truncate">
              {partName}
            </Tag>
          ))}
        </div>
      )}
      {!isEditing && (
        <div className="mt-4 flex max-w-full flex-wrap gap-1 overflow-hidden">
          {field?.spareParts?.map((partName) => (
            <Tag size="sm" key={partName} className="max-w-[100px] truncate">
              {partName}
            </Tag>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
