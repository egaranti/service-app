import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
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

import { useUserStore } from "@/stores/useUserStore";

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

const BulkUploadAlertDialog = ({ open, onOpenChange, onRefresh }) => {
  const { toast } = useToast();
  const { bulkUploadUsers } = useUserStore();
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Toplu Kullanıcı Yükleme</AlertDialogTitle>
        </AlertDialogHeader>
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
            <AlertDialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading || isUploading ? "Yükleniyor..." : "Yükle"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkUploadAlertDialog;
