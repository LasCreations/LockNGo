"use client";

// components/ReCaptcha.tsx
import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ onVerify }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      onChange={onVerify}
    />
  );
};

export default ReCaptcha;

