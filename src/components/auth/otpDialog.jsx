import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@egaranti/components";

import { useEffect, useState } from "react";

//import AuthService from "@/services/authService";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";

import { cn } from "@/lib/utils";

export default function OtpDialog({
  open,
  onOpenChange,
  onVerify,
  otp,
  setOtp,
}) {
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [open, countdown]);

  useEffect(() => {
    if (otp.length === 6) {
      onVerify();
    }
  }, [otp]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {/* <Button
              variant="secondaryGray"
              onClick={handleResendOtp}
              disabled={countdown > 0 || loading}
              className="text-sm"
            >
              {countdown > 0
                ? `${countdown} saniye bekleyiniz`
                : "Tekrar Kod Gönder"}
            </Button> */}
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
