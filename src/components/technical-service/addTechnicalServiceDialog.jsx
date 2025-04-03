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
import { useToast } from "@egaranti/components";
import { Textarea } from "@egaranti/components";
import { ScrollArea } from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { useTechnicalServiceStore } from "@/stores/useTechnicalServiceStore";

import * as z from "zod";

const formSchema = z.object({
  name: z
    .string({ invalid_type_error: "İsim en az 2 karakter olmalıdır" })
    .min(2, "İsim en az 2 karakter olmalıdır"),
  phone: z
    .string({
      invalid_type_error: "Telefon numarası en az 10 karakter olmalıdır",
    })
    .min(10, "Telefon numarası en az 10 karakter olmalıdır")
    .regex(/^\d{10}$/, "Telefon numarası 5xxxxxxxxx formatında olmalıdır"),
  address: z
    .string({ invalid_type_error: "Adres en az 2 karakter olmalıdır" })
    .min(2, "Adres en az 2 karakter olmalıdır"),
  authorizedPerson: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  corporatePhone: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  secondPhone: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  email: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

const AddTechnicalServiceDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { addUser } = useTechnicalServiceStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      authorizedPerson: "",
      corporatePhone: "",
      secondPhone: "",
      email: "",
    },
  });

  const onSubmit = async (data) => {
    await addUser([data])
      .then(() => {
        toast({
          variant: "success",
          title: "Yeni teknik servis eklendi",
        });
        onOpenChange(false);
        form.reset();
      })
      .catch((error) => {
        toast({
          variant: "error",
          title: "Teknik servis eklenirken hata oluştu",
          description: error.message,
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-4">
        <DialogHeader>
          <DialogTitle>Yeni Teknik Servis Ekle</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="p-3">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="5xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorizedPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yetkili Kişi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="corporatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kurumsal Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="5xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İkinci Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="5xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddTechnicalServiceDialog;
