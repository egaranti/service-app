import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@egaranti/components";

import { useEffect, useState } from "react";

import AuthService from "@/services/authService";

import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";

import { cn } from "@/lib/utils";

export default function OtpDialog({ isOpen, onClose, onVerify, phone, email }) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("phone");

  useEffect(() => {
    let timer;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      await AuthService.generateOtp(
        verificationMethod === "phone" ? phone : email,
      );
      setCountdown(60);
      setError("");
    } catch (error) {
      setError("OTP gönderirken bir hata oluştu.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      if (otp.length !== 6) {
        setError("Lütfen 6 haneli kodu giriniz.");
        setLoading(false);
        return;
      }
      await AuthService.verifyOtp(
        verificationMethod === "phone" ? phone : email,
        otp,
      );
      onVerify();
      setLoading(false);
    } catch (error) {
      setError("Doğrulama kodu hatalı.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Doğrulama Kodu</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <OTPInput
            value={otp}
            onChange={setOtp}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            containerClassName="flex gap-3 justify-center"
            render={({ slots }) => (
              <div className="flex justify-center gap-3">
                {slots.map((slot, index) => (
                  <Slot key={index} {...slot} />
                ))}
              </div>
            )}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="secondaryGray"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isResending}
              className="text-sm"
            >
              {countdown > 0
                ? `${countdown} saniye bekleyiniz`
                : "Tekrar Kod Gönder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Slot = (props) => {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-md border border-[#D3DBE9] font-medium text-[#364153]",
        props.isActive && "border-[#0049E6] text-[#111729]",
      )}
      {...props}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
};
