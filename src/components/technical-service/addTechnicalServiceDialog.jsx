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
    .string("İsim en az 2 karakter olmalıdır")
    .min(2, "İsim en az 2 karakter olmalıdır"),
  phone: z
    .string("Telefon numarası en az 10 karakter olmalıdır")
    .min(10, "Telefon numarası en az 10 karakter olmalıdır")
    .regex(/^\d{10}$/, "Telefon numarası 5xxxxxxxxx formatında olmalıdır"),
  address: z
    .string("Adres en az 2 karakter olmalıdır")
    .min(2, "Adres en az 2 karakter olmalıdır"),
  authorizedPerson: z
    .string("Yetkili kişi adı en az 2 karakter olmalıdır")
    .min(2, "Yetkili kişi adı en az 2 karakter olmalıdır"),
  corporatePhone: z
    .string("Kurumsal telefon numarası en az 10 karakter olmalıdır")
    .min(10, "Kurumsal telefon numarası en az 10 karakter olmalıdır")
    .regex(
      /^\d{10}$/,
      "Kurumsal telefon numarası 5xxxxxxxxx formatında olmalıdır",
    ),
  secondPhone: z
    .string("İkinci telefon numarası en az 10 karakter olmalıdır")
    .min(10, "İkinci telefon numarası en az 10 karakter olmalıdır")
    .regex(
      /^\d{10}$/,
      "İkinci telefon numarası 5xxxxxxxxx formatında olmalıdır",
    ),
  email: z
    .string("E-posta adresi geçerli olmalıdır")
    .email("E-posta adresi geçerli olmalıdır"),
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
    await addUser([data]).then(() => {
      onOpenChange(false);
      form.reset();
      toast({
        variant: "success",
        title: "Yeni teknik servis eklendi",
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
