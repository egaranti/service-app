import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  RadioGroup,
  RadioGroupItem,
} from "@egaranti/components";
import { useToast } from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import ConfirmationDialog from "./confirmationDialog";
import SummaryCard from "./summaryCard";

import * as z from "zod";

const userSchema = z.object({
  senderType: z.literal("user"),
  fullName: z.string().min(2, {
    message: "Ad Soyad en az 2 karakter olmalıdır.",
  }),
  phone: z.string().min(10, {
    message: "Geçerli bir telefon numarası giriniz.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
});

const companySchema = z.object({
  senderType: z.literal("company"),
  companyName: z.string().min(2, {
    message: "Firma adı en az 2 karakter olmalıdır.",
  }),
  taxNumber: z.string().min(10, {
    message: "Geçerli bir vergi numarası giriniz.",
  }),
  taxOffice: z.string().min(2, {
    message: "Vergi dairesi en az 2 karakter olmalıdır.",
  }),
  phone: z.string().min(10, {
    message: "Geçerli bir telefon numarası giriniz.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
});

const formSchema = z.discriminatedUnion("senderType", [
  userSchema,
  companySchema,
]);

function customerInfoForm({ onCancel, onSubmit, defaultValues, formData }) {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderType: "user",
      fullName: "",
      phone: "",
      email: "",
      companyName: "",
      taxNumber: "",
      taxOffice: "",
    },
  });

  const senderType = form.watch("senderType");

  useEffect(() => {
    if (senderType === "user") {
      form.setValue("companyName", "");
      form.setValue("taxNumber", "");
      form.setValue("taxOffice", "");
    } else {
      form.setValue("fullName", "");
    }
  }, [senderType, form]);

  function onSubmit(values) {
    setShowConfirmation(true);
  }

  function handleConfirm() {
    setShowConfirmation(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="formBox">
        <h1 className="text-lg font-medium text-[#101828]">Genel Özet</h1>
        <SummaryCard price={formData?.productInfo?.price} />
      </div>
      <div className="formBox">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="mb-4 text-lg font-medium">Gönderim Bilgileri</h2>
              <FormField
                control={form.control}
                name="senderType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gönderi Tipi</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="user" />
                          </FormControl>
                          <FormLabel>Kullanıcı</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="company" />
                          </FormControl>
                          <FormLabel>Firma</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h2 className="mb-4 text-lg font-medium">Müşteri Bilgileri</h2>
              <div className="grid gap-4">
                {senderType === "company" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firma Adı</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vergi Numarası</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxOffice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vergi Dairesi</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adı Soyadı</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon Numarası</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={onCancel} variant="secondaryGray" type="button">
                Vazgeç
              </Button>
              <Button type="submit">Oluştur</Button>
            </div>
          </form>
        </Form>
      </div>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default customerInfoForm;
