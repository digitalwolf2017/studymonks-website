"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./myAccount.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function MyAccountClient() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/student/login");
    }
    if (user) {
      setEmail(user.email || "student@studymonks.com");
      setTempEmail(user.email || "student@studymonks.com");
    }
  }, [loading, isLoggedIn, user, router]);

  const emailInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing && emailInputRef.current) {
      const input = emailInputRef.current;
      input.focus();
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setTempEmail(email);
    setIsEditing(true);
  };

  const handleSave = () => {
    setEmail(tempEmail);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempEmail(email);
    setIsEditing(false);
  };

  return (
    <div className={styles.innerWrapper}>
      <div className={styles.innerContainer}>
        <h1 className="sectionHeading">My Profile</h1>
        <div className={styles.profileWrapper}>
          <div className={styles.profileInfo}>
            <button className={styles.editBtn} onClick={handleEdit} type="button">
              <Image
                src={"/assets/images/edit-white.svg"}
                width={20}
                height={20}
                alt="icon"
              />
            </button>

            <div className={styles.infoRow}>
              <p>Full Name</p>
              <h3>{user?.name || "Student"}</h3>
            </div>

            <div className={styles.infoRow}>
              <p>Classroom / Grade</p>
              <h3>{user?.current_class_id ? `Class #${user.current_class_id}` : "Cambridge Enrolled"}</h3>
            </div>

            <div className={styles.infoRow}>
              <p>Phone Number</p>
              <h3>{user?.phone || "Not provided"}</h3>
            </div>

            <div className={styles.infoRow}>
              <p>Email</p>
              <input
                ref={emailInputRef}
                type="text"
                value={tempEmail}
                disabled={!isEditing}
                onChange={(e) => setTempEmail(e.target.value)}
              />
            </div>

            {isEditing && (
              <div className={styles.infoRow}>
                <p></p>
                <button
                  className="button greenBtn"
                  onClick={handleSave}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="button greyBtn"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className={styles.buttonWrapper}>
              <Link href={"/update-password"} className="button">
                Reset Password
              </Link>
            </div>
          </div>

          <div className={styles.referralsWrap}>
            <p>My Student ID</p>
            <h3>SM{String(user?.id || 10001).padStart(6, "0")}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

