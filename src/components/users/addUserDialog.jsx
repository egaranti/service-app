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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { useUserStore } from "@/stores/useUserStore";

import * as z from "zod";

const departments = [
  { value: "it", label: "IT" },
  { value: "hr", label: "İK" },
  { value: "finance", label: "Finans" },
  { value: "sales", label: "Satış" },
];

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "Kullanıcı" },
  { value: "manager", label: "Yönetici" },
];

const formSchema = z.object({
  name: z
    .string("İsim en az 2 karakter olmalıdır")
    .min(2, "İsim en az 2 karakter olmalıdır"),
  surname: z
    .string("Soyisim en az 2 karakter olmalıdır")
    .min(2, "İsim en az 2 karakter olmalıdır"),
  phone: z
    .string("Telefon numarası en az 10 karakter olmalıdır")
    .min(10, "Telefon numarası en az 10 karakter olmalıdır")
    .regex(/^\d{10}$/, "Telefon numarası 5xxxxxxxxx formatında olmalıdır"),
  email: z
    .string("Geçerli bir email adresi giriniz")
    .email("Geçerli bir email adresi giriniz"),
  role: z.string("Rol seçiniz").min(1, "Rol seçiniz"),
});

const AddUserDialog = ({ open, onOpenChange }) => {
  const { addUser } = useUserStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      department: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    await addUser([data]).then(() => {
      form.reset();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Yeni Personel Ekle</DialogTitle>
        </DialogHeader>

        {/* Wrap the entire form (including the submit button) in the form element */}
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soyad</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Input placeholder="Call Center" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
