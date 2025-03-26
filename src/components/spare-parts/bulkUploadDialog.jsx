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
  file: z.instanceof(File).refine(
    (file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension === "csv" || extension === "xlsx";
    },
    { message: "Lütfen .csv veya .xlsx formatında bir dosya seçin" },
  ),
});

const BulkUploadDialog = ({ open, onOpenChange, onSuccess }) => {
  const { toast } = useToast();
  const { bulkCreate, loading } = useSparePartsStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (values) => {
    const success = await bulkCreate(values.file);

    if (success) {
      toast({
        title: "Dosya yüklendi",
        variant: "success",
      });

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: "Bir hata oluştu",
        description: "Lütfen tekrar deneyin",
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Toplu Yedek Parça Yükleme</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondaryGray"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" loading={loading}>
                Yükle
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
