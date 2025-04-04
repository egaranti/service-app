import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  Tag,
} from "@egaranti/components";

import { useEffect, useState } from "react";

import BaseFieldRenderer from "./BaseFieldRenderer";

import SparePartsService from "@/services/sparePartsService";

import { CheckCircle } from "lucide-react";
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
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedItems(value || []);
    if (productId) {
      fetchSpareParts();
    }
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondaryColor"
            className="w-full justify-between"
            disabled={disabled || loading}
          >
            Yedek parça seçimi için tıkla
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yedek Parça Seçimi</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">Yükleniyor...</div>
            </div>
          ) : spareParts.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">Yedek parça bulunamadı</div>
            </div>
          ) : (
            <ScrollArea className="h-64 overflow-y-auto pr-4">
              <div className="space-y-2">
                {spareParts.map((part) => (
                  <div
                    key={part.id}
                    className={`flex cursor-pointer items-center rounded-md border p-3 transition-colors hover:bg-gray-50 ${
                      isOptionSelected(part.name)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleSelectChange(part.name)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{part.name}</h4>
                        {isOptionSelected(part.name) && (
                          <CheckCircle className="text-primary h-5 w-5" />
                        )}
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
                        <p>Kod: {part.code || "-"}</p>
                        <p>Fiyat: {part.price ? `${part.price} ₺` : "-"}</p>
                        <p>Stok: {part.stock || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="mt-4">
            <Button className="w-full" onClick={() => setDialogOpen(false)}>
              Tamam ({selectedItems.length} parça seçildi)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedItems.length > 0 && (
        <div className="mt-4 flex max-w-full flex-wrap gap-1 overflow-hidden">
          {selectedItems?.map((partName) => (
            <Tag
              size="sm"
              key={partName}
              className="truncate"
              onRemove={() => handleSelectChange(partName)}
            >
              {partName}
            </Tag>
          ))}
        </div>
      )}
      {!isEditing && field?.spareParts?.length > 0 && (
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
    spareParts: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  touched: PropTypes.bool,
  disabled: PropTypes.bool,
  isEditing: PropTypes.bool,
  productId: PropTypes.string,
};

export default SparePartFieldRenderer;
