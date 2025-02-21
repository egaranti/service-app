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

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useTechnicalServiceStore } from "@/stores/useTechnicalServiceStore";

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

const BulkUploadDialog = ({ open, onOpenChange, onRefresh }) => {
  const { toast } = useToast();
  const { bulkUploadUsers } = useTechnicalServiceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setIsUploading(true);
    const fileType = values.file.name.split(".").pop()?.toLowerCase();

    try {
      await bulkUploadUsers(values.file, fileType);
      toast({
        variant: "success",
        description: "Kullanıcılar başarıyla yüklendi",
      });
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Dosya yüklenirken bir hata oluştu",
      });
      console.error("Error during bulk upload:", error);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Toplu Teknik Servis Yükleme</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={(e) => onChange(e.target.files[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading || isUploading ? "Yükleniyor..." : "Yükle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
