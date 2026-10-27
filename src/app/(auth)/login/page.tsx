"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLogin } from "@/hooks/login";
import styles from "./login.module.scss";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  // Use the specific login hook
  const { login } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email.trim()) {
      toast.error("Email or Phone is required");
      return false;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      email_phone: form.email,
      password: form.password,
    };

    login.mutate(payload, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Login successful");
          router.push("/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Invalid credentials";
        toast.error(msg);
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.heroImage}>
            <Image
              src="/assets/new_assests/img/greenBackground.png"
              alt="Study Monk hero"
              fill
              priority
            />
          </div>
          <div className={styles.assetLogo}>
            <Image
              src="/assets/new_assests/img/study_monk_logo.png"
              alt="Study monk logo"
              width={238}
              height={39}
            />
          </div>
          <div className={styles.backgroundblendImg}>
            <Image
              src="/assets/new_assests/img/Asset 1@3x 1.png"
              alt="Background blend"
              fill
              priority
            />
          </div>
          <p className={styles.taglineText}>
            Inspiring Mentors. Infinite Possibilities.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Student Login</h2>
            <p className={styles.subtitle}>
              Enter your email/phone and password
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email or Phone</label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="Enter your email or phone"
              value={form.email}
              onChange={handleChange}
              disabled={login.isPending}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              disabled={login.isPending}
            />
          </div>

          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={handleSubmit}
              disabled={login.isPending}
              type="button"
            >
              {login.isPending ? "Please wait..." : "Sign In"}
            </button>
            <Link className={styles.link} href="/forgotpassword">
              Forgot password?
            </Link>
          </div>

          <p className={styles.meta}>
            Don’t have an account?{" "}
            <Link className={styles.link} href="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
