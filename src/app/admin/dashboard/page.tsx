"use client";

import React from "react";
import styles from "./adminDashboard.module.scss";

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h1>Administration & Control Hub</h1>
          <p>Real-time platform analytics, student records, and mentor scheduling.</p>
        </div>
        <button
          className={styles.quickActionBtn}
          onClick={() => alert("Schedule Live Session modal")}
          type="button"
        >
          <span>＋</span> Schedule New Live Class
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Total Students</span>
            <span className={styles.cardIcon}>👨‍🎓</span>
          </div>
          <div className={styles.cardValue}>1,420</div>
          <div className={styles.cardSub}>↑ +12% from last month</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Live Batches Today</span>
            <span className={styles.cardIcon}>🔴</span>
          </div>
          <div className={styles.cardValue}>8</div>
          <div className={styles.cardSub}>Across Cambridge Primary & Secondary</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Active Subscriptions</span>
            <span className={styles.cardIcon}>💎</span>
          </div>
          <div className={styles.cardValue}>984</div>
          <div className={styles.cardSub}>96.4% renewal rate</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Active Mentors</span>
            <span className={styles.cardIcon}>🧑‍🏫</span>
          </div>
          <div className={styles.cardValue}>32</div>
          <div className={styles.cardSub}>1:8 student-mentor ratio</div>
        </div>
      </div>

      {/* Today's Live Class Management */}
      <div className={styles.dataPanel}>
        <div className={styles.panelHeader}>
          <h2>Today&apos;s Live Sessions Schedule</h2>
          <span className={styles.badge}>Live Stream Monitoring</span>
        </div>

        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr>
                <th>Batch / Subject</th>
                <th>Grade / Curriculum</th>
                <th>Mentor</th>
                <th>Time Slot</th>
                <th>Enrolled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Mathematics: Algebraic Fractions</strong></td>
                <td>Cambridge Lower Secondary (Grade 8)</td>
                <td>Dr. Sarah Jenkins</td>
                <td>04:00 PM - 05:00 PM</td>
                <td>8 / 8 Students</td>
                <td><span className={`${styles.statusPill} ${styles.active}`}>Upcoming</span></td>
              </tr>
              <tr>
                <td><strong>Science: Cell Biology & Genetics</strong></td>
                <td>Cambridge Lower Secondary (Grade 7)</td>
                <td>Prof. David Verma</td>
                <td>05:30 PM - 06:30 PM</td>
                <td>7 / 8 Students</td>
                <td><span className={`${styles.statusPill} ${styles.active}`}>Upcoming</span></td>
              </tr>
              <tr>
                <td><strong>English: Analytical Essay Writing</strong></td>
                <td>Cambridge Primary (Grade 5)</td>
                <td>Ms. Ananya Sharma</td>
                <td>07:00 PM - 08:00 PM</td>
                <td>6 / 8 Students</td>
                <td><span className={`${styles.statusPill} ${styles.pending}`}>Draft</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Student Registrations */}
      <div className={styles.dataPanel}>
        <div className={styles.panelHeader}>
          <h2>Recent Student Enrollments</h2>
          <span className={styles.badge}>Live Ingestion</span>
        </div>

        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email / Contact</th>
                <th>Curriculum Pathway</th>
                <th>Registered Date</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Aarav Patel</strong></td>
                <td>aarav.patel@example.com</td>
                <td>Cambridge Lower Secondary</td>
                <td>Today, 11:20 AM</td>
                <td><span className={`${styles.statusPill} ${styles.active}`}>Paid Pro</span></td>
              </tr>
              <tr>
                <td><strong>Maya Krishnan</strong></td>
                <td>maya.k@example.com</td>
                <td>Cambridge Primary</td>
                <td>Today, 09:45 AM</td>
                <td><span className={`${styles.statusPill} ${styles.active}`}>Paid Pro</span></td>
              </tr>
              <tr>
                <td><strong>Rohan Mehta</strong></td>
                <td>rohan.m@example.com</td>
                <td>Cambridge Lower Secondary</td>
                <td>Yesterday</td>
                <td><span className={`${styles.statusPill} ${styles.pending}`}>Trial</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

