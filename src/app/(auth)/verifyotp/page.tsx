"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./verifyotp.module.scss";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }

    toast.success("OTP Verified");
    router.push("/resetpassword"); // → redirect to reset page
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        {/* LEFT SECTION */}
        <div className={styles.left}>
          <div className={styles.heroImage}>
            <Image
              src="/assets/new_assests/img/greenBackground.png"
              alt="Background"
              fill
              priority
            />
          </div>

          <div className={styles.assetLogo}>
            <Image
              src="/assets/new_assests/img/study_monk_logo.png"
              alt="Study Monk Logo"
              width={220}
              height={40}
            />
          </div>

          <div className={styles.backgroundblendImg}>
            <Image
              src="/assets/new_assests/img/Asset 1@3x 1.png"
              alt="Blend"
              fill
              priority
            />
          </div>

          <p className={styles.taglineText}>
            Inspiring Mentors. Infinite Possibilities.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.right}>
          <h2 className={styles.title}>Verify OTP</h2>
          <p className={styles.subtitle}>
            Otp has been sent to your registered phone
          </p>

          {/* OTP BOXES */}
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                className={styles.otpBox}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
              />
            ))}
          </div>

          <p className={styles.resend}>Resend OTP in 20s</p>

          <button className={styles.primaryBtn} onClick={handleSubmit}>
            Submit
          </button>

          <Link href="/login" className={styles.backToLogin}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
