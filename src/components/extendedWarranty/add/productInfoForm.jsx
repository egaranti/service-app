import {
  Button,
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

import { useForm } from "react-hook-form";

import * as z from "zod";

const formSchema = z.object({
  product: z.string().min(1, "Ürün seçiniz"),
  serviceType: z.string().min(1, "Ek hizmet türü seçiniz"),
  price: z.string().min(1, "Ürün fiyatı giriniz"),
  paymentType: z.string().min(1, "Ödeme türü seçiniz"),
  egarantiPlusNo: z.string().min(1, "egaranti Plus No giriniz"),
});

function ProductInfoForm({ onNext, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: defaultValues?.product || "",
      serviceType: defaultValues?.serviceType || "",
      price: defaultValues?.price || "",
      paymentType: defaultValues?.paymentType || "",
      egarantiPlusNo: defaultValues?.egarantiPlusNo || "",
    },
  });

  function onSubmit(values) {
    onNext(values);
  }

  return (
    <div className="formBox">
      <div>
        <h1 className="text-lg font-medium text-[#101828]">Ürün Bilgisi</h1>
        <p className="my-5 mt-2 text-[#667085]">
          egaranti Plus gönderimi için eksik ürün ve müşteri bilgilerini
          doldurunuz.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ürün seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fakir-chef">
                      Fakir Chef Pastro Mutfak Şefi Rosie
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ek Hizmet Türü</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ek hizmet türü seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-year">
                      1 Yıl Uzatılmış Garanti
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Fiyatı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ödeme Türü</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ödeme türü seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bayi">Bayi Tahsilatı</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100"
            onClick={() => {
              /* Implement barcode scanner */
            }}
          >
            Barkod Okuyucuyu Aç
          </Button>

          <FormField
            control={form.control}
            name="egarantiPlusNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>egaranti Plus No</FormLabel>
                <FormControl>
                  <Input placeholder="FA112234394943" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit">İlerle</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ProductInfoForm;
