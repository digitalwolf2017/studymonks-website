"use client";

import Link from "next/link";
import styles from "../header/header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ClassRoom, useGetClassRooms } from "@/hooks/login";
import { useAuth } from "@/auth/AuthContext";
import React from "react";

export default function NewHeaderCard() {
  const pathname = usePathname();
  const router = useRouter();

  const auth = useAuth();

  const [user, setUser] = useState<any>(null);
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
  const [selected, setSelected] = useState<string>("");

  const [classOpen, setClassOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const classRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!auth.loading && !auth.isLoggedIn) {
      router.push("/student/login");
    }
  }, [auth.loading, auth.isLoggedIn, router]);

  const { getClassRooms } = useGetClassRooms();

  /* -------------------- Load user -------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("study_monk_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* -------------------- Fetch class rooms (ONLY ONCE) -------------------- */
  useEffect(() => {
    getClassRooms.refetch().then((res: any) => {
      const rooms = res?.data?.data || [];
      setClassRooms(rooms);

      const storedUser = localStorage.getItem("study_monk_user");
      if (storedUser && rooms.length) {
        const parsedUser = JSON.parse(storedUser);
        const currentClass = rooms.find(
          (cls: ClassRoom) => cls.id === parsedUser.current_class_id
        );
        if (currentClass) {
          setSelected(currentClass.title);
        }
      }
    });
  }, []);

  /* -------------------- Close dropdowns on outside click -------------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        classRef.current &&
        !classRef.current.contains(event.target as Node)
      ) {
        setClassOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- Helpers -------------------- */
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = user ? getInitials(user.name) : "U";

  const toggleClass = () => setClassOpen((p) => !p);
  const toggleProfile = () => setProfileOpen((p) => !p);
  const handleToggle = () => setOpen((p) => !p);

  /* -------------------- Select class -------------------- */
  const choose = (cls: ClassRoom) => {
    setSelected(cls.title);
    setClassOpen(false);

    const storedUser = localStorage.getItem("study_monk_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.current_class_id = cls.id;
      localStorage.setItem("study_monk_user", JSON.stringify(parsedUser));
      setUser(parsedUser);
    }
  };

  /* -------------------- Logout -------------------- */
  const handleLogout = () => {
    auth.logout(); // clear token + user
    router.push("/student/login"); // redirect
  };

  const navItems = [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "My Learning", href: "/student/my-learning" },
    { label: "Live Classes", href: "/live-classes" },
    { label: "WorkSheets", href: "/student/worksheets" },
    { label: "MCQ Practices", href: "/mcq-practices" },
    { label: "Subscription", href: "/subscription" },
    { label: "Order History", href: "/student/order-history" },
  ];

  return (
    <>
      <div className={styles.navWrapper}>
        <div className={styles.navLeftWrap}>
          <Link href="/student/dashboard">
            <Image
              src={"/assets/images/logo.png"}
              width={150}
              height={24}
              alt="icon"
              className={styles.navLogo}
            />
          </Link>

          <div className={styles.navigationWrap}>
            <nav className={styles.nav}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${
                      isActive ? styles.active : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={styles.navRightWrap}>
          {/* Class Dropdown */}
          <div className={styles.classDropDownWrap} ref={classRef}>
            <div className={styles.classWrap} onClick={toggleClass}>
              <p>{selected || "Select Class"}</p>
              <Image
                src={"/assets/images/drop-arrow.svg"}
                width={16}
                height={16}
                alt="icon"
                className={styles.dropImg}
                style={{
                  transform: classOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </div>

            <div
              className={styles.classlist}
              style={{ display: classOpen ? "flex" : "none" }}
            >
              {classRooms.map((cls) => (
                <button key={cls.id} onClick={() => choose(cls)}>
                  {cls.title}
                </button>
              ))}
            </div>
          </div>

          {/* Notification */}
          <Link href={"/notification"} className={styles.notificationWrap}>
            <Image
              src={"/assets/images/notification-on.svg"}
              width={24}
              height={24}
              alt="icon"
              className={styles.notiImg}
            />
            <span className={styles.badge}>5</span>
          </Link>

          {/* Profile Dropdown */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button className={styles.ProfileDiv} onClick={toggleProfile}>
              <span>{initials}</span>
            </button>

            <div
              className={styles.floatWrap}
              style={{ display: profileOpen ? "flex" : "none" }}
            >
              <p>Hi, {user?.name || "User"}</p>
              <ul>
                <li>
                  <Link href="/student/my-account">My account</Link>
                </li>
                <li>
                  <Link href="/subscription">My Subscriptions</Link>
                </li>
                <li>
                  <Link href="/student/my-account">My Referrals</Link>
                </li>
                <br />
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      font: "inherit",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button className={styles.menuTriger} onClick={handleToggle}>
            {!open ? (
              <Image
                src="/assets/images/menu.svg"
                width={24}
                height={24}
                alt="menu icon"
              />
            ) : (
              <Image
                src="/assets/images/close.svg"
                width={24}
                height={24}
                alt="close icon"
              />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Menu */}
      <div
        className={`${styles.resNavWrapper} ${open ? styles.resNavActive : ""}`}
      >
        <div className={styles.navRes}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
