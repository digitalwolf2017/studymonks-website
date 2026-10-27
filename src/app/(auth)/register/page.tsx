"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useStudentRegister, useGetClassRooms } from "@/hooks/login";
import styles from "./register.module.scss";

export default function Register() {
  const router = useRouter();

  // 1. Initialize Hooks
  const { studentRegister } = useStudentRegister();
  const { getClassRooms } = useGetClassRooms();

  // 2. Extract Query Data
  // getClassRooms contains the react-query result object (data, isLoading, etc.)
  const { data: classRoomData, isLoading: isClassLoading } = getClassRooms;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    class_room_id: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!form.class_room_id) {
      toast.error("Classroom is required");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be 6+ characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Prepare Payload
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
      class_room_id: Number(form.class_room_id),
      phone: form.phone,
    };

    studentRegister.mutate(payload, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Registration successful!");
          router.push("/dashboard");
        } else {
          toast.error(data.message || "Registration failed");
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Registration failed. Try again.";
        toast.error(msg);
      },
    });
  };

  // Combine loading states
  const isLoading = studentRegister.isPending || isClassLoading;

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
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className={styles.assetLogo}>
            <Image
              src="/assets/new_assests/img/study_monk_logo.png"
              alt="Logo"
              width={238}
              height={39}
              priority
            />
          </div>
          <div className={styles.backgroundblendImg}>
            <Image
              src="/assets/new_assests/img/Asset 1@3x 1.png"
              alt="Blend"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className={styles.taglineText}>Grow. Learn. Succeed.</p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className={styles.right}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Student Registration</h2>
            <p className={styles.subtitle}>
              Fill the form to create your account
            </p>
          </div>

          {/* NAME */}
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* EMAIL */}
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* CLASSROOM DROPDOWN */}
          <div className={styles.field}>
            <label htmlFor="class_room_id">Select Class</label>
            <select
              id="class_room_id"
              name="class_room_id"
              value={form.class_room_id}
              onChange={handleChange}
              disabled={isLoading}
              className={styles.selectInput}
            >
              <option value="" disabled>
                -- Select your class --
              </option>
              {classRoomData?.data?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.instituteType})
                </option>
              ))}
            </select>
          </div>

          {/* PHONE */}
          <div className={styles.field}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={handleSubmit}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? "Please wait..." : "Register"}
            </button>
            <p className={styles.meta}>
              Already have an account?{" "}
              <Link className={styles.link} href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
