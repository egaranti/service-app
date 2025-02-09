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
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await login(values);

      if (response) {
        setShowOtpDialog(true);
      }
    } catch (error) {}
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
                {/* 
                  username phone number or email 
                */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Telefon Numarası veya E-posta Adresi
                      </FormLabel>
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
