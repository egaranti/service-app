import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { useSparePartsStore } from "@/stores/useSparePartsStore";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Parça adı zorunludur" }),
  stock: z.coerce.number().min(0, { message: "Stok adedi negatif olamaz" }),
  price: z.coerce.number().min(0, { message: "Fiyat negatif olamaz" }),
  code: z.string(),
});

const AddSparePartDialog = ({
  open,
  onOpenChange,
  editData,
  selectedProduct,
}) => {
  const { createProductSparePart, updateProductSparePart } =
    useSparePartsStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      stock: 0,
      price: 0,
      code: "",
    },
  });

  // Reset form on open and populate if editing
  React.useEffect(() => {
    if (open) {
      form.reset(
        editData
          ? {
              name: editData.name,
              stock: editData.stock,
              price: editData.price,
              code: editData.code,
            }
          : {
              name: "",
              stock: 0,
              price: 0,
              code: "",
            },
      );
    }
  }, [open, editData, form]);

  const onSubmit = async (values) => {
    if (editData) {
      await updateProductSparePart(editData.id, values);
    } else {
      await createProductSparePart(values);
    }
  };

  const isEditing = !!editData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Yedek Parça Düzenle" : "Yeni Yedek Parça Ekle"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {selectedProduct && (
              <div className="text-sm">
                <span className="font-medium">Ürün:</span>{" "}
                {selectedProduct.name}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parça Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Parça adını girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Adedi</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        step={0.01}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod</FormLabel>
                    <FormControl>
                      <Input placeholder="Parça kodunu girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondaryGray"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit">{isEditing ? "Güncelle" : "Ekle"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSparePartDialog;
