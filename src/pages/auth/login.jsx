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

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useAuth from "@/stores/useAuthStore";

import OtpDialog from "@/components/auth/otpDialog";

import egarantiLogo from "@/assets/egaranti.png";
import egarantiLogoBlue from "@/assets/egarantimavi.png";

import * as z from "zod";

const formSchema = z.object({
  phone: z
    .string()
    .min(10, "Geçerli bir telefon numarası giriniz")
    .max(10, "Geçerli bir telefon numarası giriniz"),
});

// User type options
const userTypes = [
  {
    id: "personal",
    title: "Personel",
    description: "Personel için giriş",
    icon: "👤",
  },
  {
    id: "technicalService",
    title: "Teknik Servis",
    description: "Yetkili teknik servis personeli için giriş",
    icon: "🔧",
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, login, generateOtp, setUserType } = useAuth();
  const { toast } = useToast();
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectedUserType, setSelectedUserType] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  // defalut olarak personal kullanıcı tipini seç
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setSelectedUserType(localStorage.getItem("user"));
    } else {
      setSelectedUserType("personal");
      localStorage.setItem("user", "personal");
    }
  }, []);

  const onSubmit = async (values) => {
    try {
      const response = await generateOtp(values.phone);
      setShowOtpDialog(true);
    } catch (error) {
      toast({
        variant: "error",
        title: "Hata",
        description:
          error.message ||
          "Telefon numaranıza OTP gönderilirken bir hata oluştu",
      });
    }
  };

  const handleOtpVerify = async () => {
    try {
      await login({
        phone: form.getValues().phone,
        countryCode: "TR",
        otpCode: otp,
      });
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

  const handleUserTypeChange = (type) => {
    setSelectedUserType(type);

    setUserType(type);
    toast({
      variant: "success",
      title: "Kullanıcı Tipi Değiştirildi",
      description:
        type === "personal"
          ? "Merchant kullanıcı seçildi"
          : "Teknik servis kullanıcısı seçildi",
    });
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

        <div className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform space-y-6 rounded-lg bg-white p-6 shadow-lg">
          {/* User Type Tabs */}
          <div className="flex w-full rounded-md bg-gray-100 p-1">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleUserTypeChange(type.id)}
                className={`flex flex-1 items-center justify-center space-x-2 rounded-md py-2 text-sm font-medium transition-all duration-200 ${
                  selectedUserType === type.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200/50"
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.title}</span>
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-semibold text-gray-800">Giriş Yap</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Telefon Numarası veya E-posta Adresi
                    </FormLabel>
                    <FormControl>
                      <Input
                        ref={field.ref}
                        placeholder="5331234554"
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
        open={showOtpDialog}
        onOpenChange={setShowOtpDialog}
        onVerify={handleOtpVerify}
        otp={otp}
        setOtp={setOtp}
        phone={form.getValues().phone}
      />
    </div>
  );
};

export default LoginPage;
