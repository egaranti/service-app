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
  useToast,
} from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { useSparePartsStore } from "@/stores/useSparePartsStore";

import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Parça adı zorunludur"),
  quantity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Stok adedi 0 veya daha büyük olmalıdır",
    }),
});

const AddSparePartDialog = ({ open, onOpenChange, onSuccess, editData }) => {
  const { toast } = useToast();
  const { createSparePart, updateSparePart, loading } = useSparePartsStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editData?.name || "",
      quantity: editData?.quantity?.toString() || "0",
    },
  });

  React.useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        quantity: editData.quantity.toString(),
      });
    }
  }, [editData, form]);

  const onSubmit = async (values) => {
    const success = editData
      ? await updateSparePart(editData.id, values)
      : await createSparePart(values);

    if (success) {
      toast({
        title: editData ? "Yedek parça güncellendi" : "Yedek parça eklendi",
        variant: "success",
      });

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: "Bir hata oluştu",
        description: "Lütfen tekrar deneyin",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editData ? "Yedek Parça Düzenle" : "Yeni Yedek Parça"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parça Adı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Adedi</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" loading={loading}>
                Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSparePartDialog;
