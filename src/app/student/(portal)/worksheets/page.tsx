"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./worksheets.module.scss";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";

interface WorksheetItem {
  id: number;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  fileUrl: string;
  marks?: string;
}

const mockWorksheets: WorksheetItem[] = [
  {
    id: 1,
    title: "Algebraic Indices and Standard Form Worksheet",
    subject: "Mathematics",
    grade: "Grade 8",
    dueDate: "Tomorrow, 05:00 PM",
    status: "Pending",
    fileUrl: "#",
  },
  {
    id: 2,
    title: "Cell Structure and Microscopy Diagnostic Lab Sheet",
    subject: "Science",
    grade: "Grade 8",
    dueDate: "Oct 31, 2026",
    status: "Pending",
    fileUrl: "#",
  },
  {
    id: 3,
    title: "Reading Comprehension & Critical Analysis Set 3",
    subject: "English",
    grade: "Grade 8",
    dueDate: "Oct 25, 2026",
    status: "Submitted",
    fileUrl: "#",
    marks: "Submitted for Review",
  },
  {
    id: 4,
    title: "Linear Equations & Word Problem Practice Paper",
    subject: "Mathematics",
    grade: "Grade 8",
    dueDate: "Oct 20, 2026",
    status: "Graded",
    fileUrl: "#",
    marks: "19 / 20 (95%)",
  },
  {
    id: 5,
    title: "Thermal Energy Transfer & Insulation Experiments",
    subject: "Science",
    grade: "Grade 8",
    dueDate: "Oct 18, 2026",
    status: "Graded",
    fileUrl: "#",
    marks: "18 / 20 (90%)",
  },
  {
    id: 6,
    title: "Global Perspectives Research Draft Worksheet",
    subject: "Global Perspectives",
    grade: "Grade 8",
    dueDate: "Nov 02, 2026",
    status: "Pending",
    fileUrl: "#",
  },
];

export default function WorksheetsPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/student/login");
    }
  }, [loading, isLoggedIn, router]);

  const filteredSheets = mockWorksheets.filter((sheet) => {
    if (statusFilter !== "All" && sheet.status !== statusFilter) {
      return false;
    }
    if (subjectFilter !== "All" && sheet.subject !== subjectFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.worksheetsWrapper}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div>
          <h1>Cambridge Curriculum Worksheets</h1>
          <p>
            Download your mentor-assigned worksheets, practice problem sets,
            and submit completed assignments.
          </p>
        </div>
        <Link href="/home-work" className={styles.submitWorkBtn}>
          <span>📤</span> Submit Homework / Worksheet
        </Link>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.statusTabs}>
          {["All", "Pending", "Submitted", "Graded"].map((status) => (
            <button
              key={status}
              className={`${styles.tabBtn} ${
                statusFilter === status ? styles.active : ""
              }`}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>

        <select
          className={styles.subjectSelect}
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="All">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="Global Perspectives">Global Perspectives</option>
        </select>
      </div>

      {/* Grid of Worksheets */}
      <div className={styles.sheetsGrid}>
        {filteredSheets.map((sheet) => (
          <div key={sheet.id} className={styles.sheetCard}>
            <div>
              <div className={styles.cardTop}>
                <span className={styles.subjectBadge}>{sheet.subject}</span>
                <span
                  className={`${styles.statusPill} ${
                    sheet.status === "Pending"
                      ? styles.pending
                      : sheet.status === "Submitted"
                      ? styles.submitted
                      : styles.graded
                  }`}
                >
                  {sheet.status === "Graded" && sheet.marks
                    ? sheet.marks
                    : sheet.status}
                </span>
              </div>

              <h2 className={styles.sheetTitle}>{sheet.title}</h2>

              <div className={styles.metaRow}>
                <span>📚 {sheet.grade}</span>
                <span>⏰ Due: {sheet.dueDate}</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <a
                href={sheet.fileUrl}
                download
                className={styles.downloadBtn}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading worksheet: ${sheet.title}`);
                }}
              >
                <span>📥</span> PDF
              </a>

              {sheet.status === "Pending" ? (
                <Link href="/home-work" className={styles.actionLink}>
                  Submit Work
                </Link>
              ) : (
                <Link href="/home-work" className={styles.actionLink}>
                  View Work
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

