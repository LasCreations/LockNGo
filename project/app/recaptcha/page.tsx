
"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function ReCaptchaPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    toast.success("ReCAPTCHA verified successfully!");
    router.push("/api/auth/signin"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-6">Verify you're not a robot</h1>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        onChange={setCaptchaToken}
        className="mb-4"
      />
      <Button
        variant="default"
        onClick={handleSubmit}
      >
         Proceed
      </Button>
    </div>
  );
}
