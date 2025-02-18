import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@egaranti/components";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useAuth from "@/stores/useAuthStore";

import OtpDialog from "@/components/auth/otpDialog";

import egarantiLogo from "@/assets/egaranti.png";
import egarantiLogoBlue from "@/assets/egarantimavi.png";

import * as z from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(1, "Telefon numarası veya e-posta adresi gereklidir"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, login, verifyOtp } = useAuth();
  const { toast } = useToast();
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values);
      if (response) {
        setShowOtpDialog(true);
      }
    } catch (error) {
      toast({
        variant: "error",
        title: "Hata",
        description: "Giriş yapılırken bir hata oluştu",
      });
    }
  };

  const handleOtpVerify = async () => {
    try {
      await verifyOtp();
      setShowOtpDialog(false);
      toast({
        variant: "success",
        title: "Başarılı",
        description: "Giriş başarılı",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "error",
        title: "Hata",
        description: error.message || "Doğrulama yapılırken bir hata oluştu",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      {/* Sol Taraf - Logo ve Gradient Arka Plan */}
      <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-[#0049E6] to-[#5379D3] p-8">
        <div className="space-y-4">
          <img
            src={egarantiLogo}
            alt="egaranti"
            className="w-24 transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="nd:block hidden text-lg font-medium tracking-wide text-white/80">
          egaranti
        </div>
      </div>

      {/* Sağ Taraf - Login Formu */}
      <div className="flex flex-1 flex-col-reverse items-end justify-between bg-gradient-to-tl from-white to-gray-300 p-8 md:flex-col">
        <img
          src={egarantiLogoBlue}
          alt="egaranti"
          className="hidden w-24 transition-transform duration-300 hover:scale-105 md:block"
        />

        <div className="absolute left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 transform space-y-8 rounded-lg bg-white p-6">
          <h1 className="text-2xl font-semibold text-gray-800">Giriş Yap</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Telefon Numarası veya E-posta Adresi
                    </FormLabel>
                    <FormControl>
                      <Input
                        ref={field.ref}
                        placeholder="5331234554 veya admin@egaranti.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-full text-end text-lg font-medium tracking-wide text-blue-800/80">
          Yetkili Servis
        </div>
      </div>

      <OtpDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        onVerify={handleOtpVerify}
        phone={form.getValues().username}
      />
    </div>
  );
};

export default LoginPage;
