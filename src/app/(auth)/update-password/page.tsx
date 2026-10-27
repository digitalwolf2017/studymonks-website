"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./updatePassword.module.scss";
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
        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <h2 className={styles.title}>Update Password</h2>
          <p className={styles.subtitle}>Please choose a strong password</p>

          {/* Password Field */}
          <div className={styles.field}>
            <label>Old Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* Password Field */}
          <div className={styles.field}>
            <label>New Password</label>
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
            <label>Confirm New Password</label>
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

          <Link href="/verifyotp" className={styles.backToLogin}>
            Forget Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
