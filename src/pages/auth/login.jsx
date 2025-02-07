import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAuth from "@/stores/useAuthStore";

import egarantiLogo from "@/assets/egaranti.png";

import * as z from "zod";

const formSchema = z.object({
  storeCode: z.string().min(1, "Mağaza/Bayi Kodu gereklidir"),
  password: z.string().min(1, "Şifre gereklidir"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, login } = useAuth();
  const [searchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeCode: searchParams.get("storeCode") || "",
      password: searchParams.get("password") || "",
    },
  });

  useEffect(() => {
    const storeCode = searchParams.get("storeCode");
    const password = searchParams.get("password");

    if (storeCode && password) {
      form.handleSubmit(onSubmit)();
    }
  }, []);

  const onSubmit = async (values) => {
    try {
      const success = await login(values);
      if (success) {
        navigate("/extended-warranty/new");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <div className="flex min-h-screen flex-col-reverse gap-12 md:flex-row">
      <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-[#0049E6] to-[#5379D3] p-5 md:p-10">
        <img src={egarantiLogo} alt="egaranti" className="w-24" />
        <div className="mt-4 text-lg text-white/80">Servis</div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="formBox mt-8 rounded-lg border p-8">
            <div>
              <h1 className="text-lg font-medium text-[#101828]">
                Servis çözümleri
              </h1>
              <p className="my-5 mt-2 text-[#667085]">
                {
                  "Aldığınız ürünün yanında sunulan sigorta poliçesini aktive edip poliçenizi oluşturmak için adımları takip ediniz."
                }
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="storeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Mağaza/Bayi Kodu"}</FormLabel>
                      <FormControl>
                        <Input placeholder="FK-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"egaranti Plus No"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
