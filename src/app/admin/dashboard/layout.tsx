"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./adminDashboard.module.scss";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("study_monk_admin_token");
      const user = localStorage.getItem("study_monk_admin_user");

      if (!token) {
        router.push("/admin/login");
      } else {
        if (user) {
          try {
            setAdminUser(JSON.parse(user));
          } catch {
            setAdminUser({ name: "Admin" });
          }
        }
        setLoading(false);
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("study_monk_admin_token");
      localStorage.removeItem("study_monk_admin_user");
    }
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0F172A", color: "#FFFFFF" }}>
        <p>Validating Administrator Credentials...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      {/* Admin Top Navbar */}
      <header className={styles.topNavbar}>
        <div className={styles.navBrand}>
          <Link href="/admin/dashboard">
            <Image
              src="/assets/img/logos.png"
              alt="Study Monk"
              width={140}
              height={44}
              className={styles.brandLogo}
              priority
            />
          </Link>
          <span className={styles.adminBadge}>ADMIN CONSOLE</span>
        </div>

        <nav className={styles.navMenu}>
          <Link
            href="/admin/dashboard"
            className={`${styles.navLink} ${pathname === "/admin/dashboard" ? styles.active : ""}`}
          >
            📊 Overview
          </Link>
          <Link
            href="/admin/dashboard"
            className={styles.navLink}
          >
            👥 Students
          </Link>
          <Link
            href="/admin/dashboard"
            className={styles.navLink}
          >
            📅 Live Batches
          </Link>
          <Link
            href="/admin/dashboard"
            className={styles.navLink}
          >
            💳 Subscriptions
          </Link>
        </nav>

        <div className={styles.navUser}>
          <div className={styles.userPill}>
            👤 {adminUser?.name || adminUser?.email || "SuperAdmin"}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} type="button">
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Content */}
      <main className={styles.dashboardContent}>{children}</main>
    </div>
  );
}

