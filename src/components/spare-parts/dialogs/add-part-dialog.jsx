import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

const AddPartDialog = ({
  open,
  onClose,
  onSubmit,
  parentId = null,
  editData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    quantity: "",
    unit: "adet",
    ...editData,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        code: editData.code || "",
        quantity: editData.quantity || "",
        unit: editData.unit || "adet",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        quantity: "",
        unit: "adet",
      });
    }
  }, [editData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, parentId });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editData
              ? "Parça Düzenle"
              : parentId
                ? "Alt Parça Ekle"
                : "Ana Parça Ekle"}
          </DialogTitle>
          <DialogDescription>
            Parça detaylarını doldurun. Tüm alanları doldurduktan sonra
            kaydetmek için "Ekle" butonuna tıklayın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Parça Adı
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Parça Kodu
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Miktar
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Birim
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleChange("unit", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Birim seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adet">Adet</SelectItem>
                  <SelectItem value="set">Set</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="lt">Lt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondaryColor" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">{editData ? "Güncelle" : "Ekle"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartDialog;
