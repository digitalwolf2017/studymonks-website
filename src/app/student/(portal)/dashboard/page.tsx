"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.scss";
import { useLiveClasses } from "@/services/liveClassesService";
import { formatDateForApi } from "@/utilities/formatter";

export default function StudentDashboardPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const [currentDateStr, setCurrentDateStr] = useState("");

  // Route protection
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/student/login");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  // Fetch live classes data for today
  const { mutate: fetchLiveClasses, data: dashboardResponse, isPending: isClassesLoading } =
    useLiveClasses();

  useEffect(() => {
    const todayApiStr = formatDateForApi(new Date());
    fetchLiveClasses({ date: todayApiStr });
  }, [fetchLiveClasses]);

  const scheduleList = dashboardResponse?.data?.live_classes_schedule || [];
  const subjectsList = dashboardResponse?.data?.live_classes_subjects || [];

  if (loading || !isLoggedIn) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <p style={{ color: "#182C74", fontWeight: 600 }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* 1. Welcome Hero Section */}
      <section className={styles.welcomeHero}>
        <div className={styles.heroContent}>
          <h1 className={styles.greeting}>
            Welcome back, {user?.name || "Student"}! 🎓
          </h1>
          <p className={styles.tagline}>
            Your Cambridge Pathway dashboard. Track your live mentor sessions,
            complete your worksheets, and strengthen your conceptual mastery.
          </p>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>
              📍 Cambridge International
            </span>
            <span className={`${styles.badge} ${styles.badgeGold}`}>
              ⭐ Enrolled & Active
            </span>
            {user?.email && (
              <span className={styles.badge}>
                ✉️ {user.email}
              </span>
            )}
          </div>
        </div>

        <div className={styles.heroDateBox}>
          <div className={styles.dateLabel}>Today&apos;s Date</div>
          <div className={styles.dateValue}>{currentDateStr}</div>
        </div>
      </section>

      {/* 2. Key Action Metrics */}
      <section className={styles.metricsGrid}>
        {/* Live Classes Card */}
        <div className={styles.metricCard}>
          <div>
            <div className={styles.cardTop}>
              <div className={styles.cardTitle}>Live Classes</div>
              <div
                className={styles.iconBox}
                style={{ background: "#EEF2FF", color: "#4F46E5" }}
              >
                🎥
              </div>
            </div>
            <div className={styles.cardValue}>{scheduleList.length} Scheduled</div>
            <div className={styles.cardDesc}>
              {scheduleList.length > 0
                ? "You have interactive live sessions today"
                : "No pending live sessions for today"}
            </div>
          </div>
          <Link href="/live-classes" className={styles.actionLink}>
            <span>Go to Live Classroom</span>
            <span>→</span>
          </Link>
        </div>

        {/* My Learning Card */}
        <div className={styles.metricCard}>
          <div>
            <div className={styles.cardTop}>
              <div className={styles.cardTitle}>Curriculum</div>
              <div
                className={styles.iconBox}
                style={{ background: "#ECFDF5", color: "#059669" }}
              >
                📚
              </div>
            </div>
            <div className={styles.cardValue}>
              {subjectsList.length > 0 ? `${subjectsList.length} Subjects` : "My Subjects"}
            </div>
            <div className={styles.cardDesc}>
              Access recordings, notes, and mentor materials
            </div>
          </div>
          <Link href="/student/my-learning" className={styles.actionLink}>
            <span>Explore Subjects</span>
            <span>→</span>
          </Link>
        </div>

        {/* Worksheets & Homework */}
        <div className={styles.metricCard}>
          <div>
            <div className={styles.cardTop}>
              <div className={styles.cardTitle}>Assignments</div>
              <div
                className={styles.iconBox}
                style={{ background: "#FEF3C7", color: "#D97706" }}
              >
                📝
              </div>
            </div>
            <div className={styles.cardValue}>Worksheets & MCQ</div>
            <div className={styles.cardDesc}>
              Practice sheets, homework reviews & diagnostic tests
            </div>
          </div>
          <Link href="/student/worksheets" className={styles.actionLink}>
            <span>View Worksheets</span>
            <span>→</span>
          </Link>
        </div>

        {/* Subscription Card */}
        <div className={styles.metricCard}>
          <div>
            <div className={styles.cardTop}>
              <div className={styles.cardTitle}>Membership</div>
              <div
                className={styles.iconBox}
                style={{ background: "#F5F3FF", color: "#7C3AED" }}
              >
                💎
              </div>
            </div>
            <div className={styles.cardValue}>Study Monk Pro</div>
            <div className={styles.cardDesc}>
              {user?.expiry_date ? `Valid till ${user.expiry_date}` : "Active Subscription"}
            </div>
          </div>
          <Link href="/subscription" className={styles.actionLink}>
            <span>Manage Plan</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* 3. Main Dashboard Content Split */}
      <div className={styles.contentSplit}>
        {/* Left Column: Live Classes Schedule */}
        <div className={styles.sectionBox}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span>📅</span> Today&apos;s Live Class Schedule
            </div>
            <Link href="/live-classes" className={styles.viewAllLink}>
              Full Calendar →
            </Link>
          </div>

          {isClassesLoading ? (
            <p style={{ color: "#64748b", padding: "20px 0" }}>Loading schedule...</p>
          ) : scheduleList.length > 0 ? (
            <div className={styles.classesList}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {scheduleList.map((item: any) => (
                <div key={item.id} className={styles.classItem}>
                  <div className={styles.classInfo}>
                    <div className={styles.subjectName}>
                      {item.title || item.subject_title || "Live Mentor Session"}
                    </div>
                    <div className={styles.mentorName}>
                      Mentor: {item.mentor_name || "Study Monk Expert"}
                    </div>
                    <div className={styles.timeText}>
                      ⏰ {item.start_time || "Scheduled Class"}
                    </div>
                  </div>
                  <Link href={`/live-work/${item.id}/${item.work_id || 1}`} className={styles.joinBtn}>
                    Enter Class
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyClasses}>
              <div className={styles.emptyIcon}>☕</div>
              <p>No live classes scheduled for today.</p>
              <Link href="/student/my-learning" className={styles.exploreBtn}>
                Watch Recorded Classes
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Quick Navigation Shortcuts */}
        <div>
          <div className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span>⚡</span> Quick Links
              </div>
            </div>

            <div className={styles.shortcutGrid}>
              <Link href="/live-classes" className={styles.shortcutItem}>
                <span className={styles.shortcutIcon}>🔴</span>
                <div className={styles.shortcutText}>
                  <div className={styles.title}>Live Interactive Classes</div>
                  <div className={styles.desc}>Join ongoing or upcoming sessions</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>

              <Link href="/mcq-practices" className={styles.shortcutItem}>
                <span className={styles.shortcutIcon}>🎯</span>
                <div className={styles.shortcutText}>
                  <div className={styles.title}>MCQ Practice Tests</div>
                  <div className={styles.desc}>Instant quiz feedback & scores</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>

              <Link href="/home-work" className={styles.shortcutItem}>
                <span className={styles.shortcutIcon}>📤</span>
                <div className={styles.shortcutText}>
                  <div className={styles.title}>Homework Submissions</div>
                  <div className={styles.desc}>Upload work for mentor review</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>

              <Link href="/student/order-history" className={styles.shortcutItem}>
                <span className={styles.shortcutIcon}>🧾</span>
                <div className={styles.shortcutText}>
                  <div className={styles.title}>Invoices & Order History</div>
                  <div className={styles.desc}>Payment receipts & invoices</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>

              <Link href="/student/my-account" className={styles.shortcutItem}>
                <span className={styles.shortcutIcon}>👤</span>
                <div className={styles.shortcutText}>
                  <div className={styles.title}>My Account & Profile</div>
                  <div className={styles.desc}>Update personal information</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

