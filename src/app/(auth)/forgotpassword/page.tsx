"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./forgotpassword.module.scss";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForgotPasswordOtp } from "@/hooks/login";

export default function ForgotPassword() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const { sendOtp } = useForgotPasswordOtp();

  const handleSubmit = () => {
    if (!phone.trim()) {
      toast.error("Phone is required");
      return;
    }

    // TODO: API call for Forgot Password OTP
    sendOtp.mutate(
      { phone },
      {
        onSuccess: () => {
          toast.success("OTP sent to your phone");
          router.push("/verifyotp"); // redirect to OTP verification
        },
        onError: () => toast.error("Failed to send OTP"),
      }
    );
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
              sizes="100vw"
            />
          </div>

          {/* Logo */}
          <div className={styles.assetLogo}>
            <Image
              src="/assets/new_assests/img/study_monk_logo.png"
              alt="Study Monk Logo"
              width={220}
              height={40}
            />
          </div>

          {/* Blend image */}
          <div className={styles.backgroundblendImg}>
            <Image
              src="/assets/new_assests/img/Asset 1@3x 1.png"
              alt="Blend"
              fill
              priority
            />
          </div>

          {/* Tagline */}
          <p className={styles.taglineText}>
            Inspiring Mentors. Infinite Possibilities.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.right}>
          <h2 className={styles.title}>Forgot Password?</h2>
          <p className={styles.subtitle}>
            Let’s help you out restoring the same
          </p>

          <div className={styles.field}>
            <label>Phone</label>
            <input
              type="phone"
              placeholder="Enter your registered phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button className={styles.primaryBtn} onClick={handleSubmit}>
            Request OTP
          </button>

          <Link href="/login" className={styles.backToLogin}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
