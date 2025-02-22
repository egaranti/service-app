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
});

const AddTechnicalServiceDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { addUser } = useTechnicalServiceStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
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
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Yeni Teknik Servis Ekle</DialogTitle>
        </DialogHeader>

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

            <DialogFooter>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTechnicalServiceDialog;
