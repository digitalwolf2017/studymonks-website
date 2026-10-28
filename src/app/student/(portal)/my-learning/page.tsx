"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./myLearning.module.scss";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";

interface SubjectCourse {
  id: number;
  title: string;
  category: string;
  mentor: string;
  icon: string;
  gradient: string;
  completedLessons: number;
  totalLessons: number;
  worksheetsCount: number;
  progressPercent: number;
}

const mockSubjects: SubjectCourse[] = [
  {
    id: 1,
    title: "Cambridge Mathematics",
    category: "Core Curriculum",
    mentor: "Dr. Sarah Jenkins",
    icon: "📐",
    gradient: "linear-gradient(135deg, #182C74 0%, #3B82F6 100%)",
    completedLessons: 14,
    totalLessons: 20,
    worksheetsCount: 8,
    progressPercent: 70,
  },
  {
    id: 2,
    title: "Cambridge Science & Physics",
    category: "Natural Sciences",
    mentor: "Prof. David Verma",
    icon: "🔬",
    gradient: "linear-gradient(135deg, #065F46 0%, #10B981 100%)",
    completedLessons: 10,
    totalLessons: 18,
    worksheetsCount: 6,
    progressPercent: 55,
  },
  {
    id: 3,
    title: "Cambridge English Language & Literature",
    category: "Humanities",
    mentor: "Ms. Ananya Sharma",
    icon: "📖",
    gradient: "linear-gradient(135deg, #7C2D12 0%, #F59E0B 100%)",
    completedLessons: 16,
    totalLessons: 20,
    worksheetsCount: 10,
    progressPercent: 80,
  },
  {
    id: 4,
    title: "Global Perspectives & Critical Thinking",
    category: "Cambridge Interdisciplinary",
    mentor: "Dr. Kevin Scott",
    icon: "🌍",
    gradient: "linear-gradient(135deg, #4C1D95 0%, #8B5CF6 100%)",
    completedLessons: 6,
    totalLessons: 12,
    worksheetsCount: 4,
    progressPercent: 50,
  },
  {
    id: 5,
    title: "Cambridge Computer Science & Logic",
    category: "Technology",
    mentor: "Mr. Alex Rogers",
    icon: "💻",
    gradient: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
    completedLessons: 8,
    totalLessons: 16,
    worksheetsCount: 5,
    progressPercent: 50,
  },
];

export default function MyLearningPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/student/login");
    }
  }, [loading, isLoggedIn, router]);

  const filteredSubjects = mockSubjects.filter((s) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "In Progress") return s.progressPercent < 100;
    if (activeFilter === "Completed") return s.progressPercent === 100;
    return true;
  });

  return (
    <div className={styles.learningWrapper}>
      {/* Header */}
      <div className={styles.headerSection}>
        <h1>My Learning & Course Modules</h1>
        <p>
          Track your Cambridge syllabus progress, watch recorded mentor
          lectures, and prepare for upcoming assessments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        {["All", "In Progress", "Completed"].map((filter) => (
          <button
            key={filter}
            className={`${styles.filterBtn} ${
              activeFilter === filter ? styles.active : ""
            }`}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className={styles.subjectsGrid}>
        {filteredSubjects.map((sub) => (
          <div key={sub.id} className={styles.subjectCard}>
            <div
              className={styles.cardBanner}
              style={{ background: sub.gradient }}
            >
              <div className={styles.iconCircle}>{sub.icon}</div>
              <span className={styles.statusBadge}>{sub.category}</span>
            </div>

            <div className={styles.cardBody}>
              <div>
                <h2 className={styles.subjectTitle}>{sub.title}</h2>
                <div className={styles.curriculumLabel}>
                  Mentor: {sub.mentor}
                </div>

                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressText}>
                    <span>Syllabus Progress</span>
                    <span>{sub.progressPercent}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${sub.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.val}>
                      {sub.completedLessons}/{sub.totalLessons}
                    </span>
                    <span className={styles.lbl}>Lectures</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.val}>{sub.worksheetsCount}</span>
                    <span className={styles.lbl}>Worksheets</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.val}>Cambridge</span>
                    <span className={styles.lbl}>Pathway</span>
                  </div>
                </div>
              </div>

              <Link
                href="/live-classes"
                className={styles.actionBtn}
              >
                <span>Continue Subject</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

