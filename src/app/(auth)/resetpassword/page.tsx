"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./resetpassword.module.scss";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // TODO: API call to reset password
    toast.success("Password reset successful");

    router.push("/login");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <h2 className={styles.title}>Reset Password</h2>
          <p className={styles.subtitle}>Please choose a strong password</p>

          {/* Password Field */}
          <div className={styles.field}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <label>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

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
