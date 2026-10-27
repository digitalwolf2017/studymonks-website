"use client";

import React, { useState, useMemo } from "react";
import styles from "./recordedDashboard.module.scss";
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import Link from "next/link";
import Image from "next/image";
import { useGetBatchDetails } from "@/services/liveClassesService";

interface RecordedDashboardClientProps {
  batchId: number;
}

export default function RecordedDashboardClient({
  batchId,
}: RecordedDashboardClientProps) {
  // ---------------- STATE ----------------
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ---------------- API ----------------
  const {
    data: batchResponse,
    isLoading,
    isPlaceholderData,
  } = useGetBatchDetails(batchId, page);

  const batchInfo = batchResponse?.data?.batch_details;
  const meetingData = batchResponse?.data?.live_meeting_details;
  const allMeetings = meetingData?.data || [];

  // ---------------- FILTER LOGIC ----------------
  const filteredMeetings = useMemo(() => {
    return allMeetings.filter((meeting: any) => {
      // TAB FILTER
      if (activeTab === "upcoming") {
        if (!(meeting.status === 0 || meeting.status === 1)) return false;
      }
      if (activeTab === "past") {
        if (meeting.status !== 2) return false;
      }

      // SEARCH FILTER
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const topicMatch = meeting.topic?.toLowerCase().includes(q);
        const subjectMatch = meeting.subject?.title?.toLowerCase().includes(q);
        if (!topicMatch && !subjectMatch) return false;
      }

      // DATE FILTER
      if (startDate || endDate) {
        const meetingDate = new Date(meeting.start_time);
        meetingDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (meetingDate < start) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (meetingDate > end) return false;
        }
      }

      return true;
    });
  }, [allMeetings, activeTab, searchQuery, startDate, endDate]);

  // ---------------- PAGINATION ----------------
  const pageNumbers = useMemo(() => {
    if (!meetingData?.last_page) return [];
    return Array.from({ length: meetingData.last_page }, (_, i) => i + 1);
  }, [meetingData?.last_page]);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= (meetingData?.last_page || 1)) setPage(p);
  };

  // ---------------- LOADING ----------------
  if (isLoading) {
    return (
      <div className={styles.innerWrapper}>
        <p
          style={{
            marginTop: 50,
            textAlign: "center",
            fontSize: "18px",
            color: "#64748b",
          }}
        >
          Loading classes...
        </p>
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className={styles.innerWrapper}>
      <div className={styles.innerContainer}>
        <SubscriptionAttention />

        {/* HEADER */}
        <div className={styles.recordedhead}>
          <h1 className={styles.pageTitle}>
            Live Classes &gt; {batchInfo?.title || "Batch"}
          </h1>

          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "upcoming" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "past" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past Classes
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filterBar}>
          <div className={styles.dateInputs}>
            <div className={styles.inputGroup}>
              <Image
                src="/assets/images/calender.svg"
                width={16}
                height={16}
                alt="Start date"
                aria-hidden="true"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Start date"
              />
            </div>

            <div className={styles.inputGroup}>
              <Image
                src="/assets/images/calender.svg"
                width={16}
                height={16}
                alt="End date"
                aria-hidden="true"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="End date"
              />
            </div>
          </div>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by topic or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search classes"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className={styles.mainContainer}>
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <div className={styles.col}>Class ID</div>
              <div className={styles.col}>Subject</div>
              <div className={styles.col}>Live Class Topic</div>
              <div className={styles.col}>Date & Time</div>
              <div className={styles.col}>Action</div>
            </div>

            {filteredMeetings.length ? (
              filteredMeetings.map((meeting: any) => (
                <div key={meeting.id} className={styles.tableRow}>
                  <div className={styles.col} data-label="Class ID">
                    #{meeting.id}
                  </div>
                  <div className={styles.col} data-label="Subject">
                    {meeting.subject?.title || "General"}
                  </div>
                  <div className={styles.col} data-label="Topic">
                    <p className={styles.topicText}>{meeting.topic}</p>
                  </div>
                  <div className={styles.col} data-label="Date & Time">
                    <div className={styles.dateTime}>
                      <span>
                        {new Date(meeting.start_time).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </span>
                      <span className={styles.timeText}>
                        {new Date(meeting.start_time).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "numeric", hour12: true }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={styles.col} data-label="Action">
                    {meeting.status === 1 ? (
                      <Link
                        href={`/live/${meeting.id}`}
                        className={styles.joinLiveBtn}
                      >
                        Join Live Now
                      </Link>
                    ) : meeting.status === 2 ? (
                      <Link
                        href={`/recorded-classes/${meeting.id}`}
                        className={styles.viewBtn}
                      >
                        View Recording
                      </Link>
                    ) : (
                      <span
                        className={styles.lockedIcon}
                        title="Class not started"
                      >
                        🔒 Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Image
                  src="/assets/images/note-circle.svg"
                  width={60}
                  height={60}
                  alt="empty"
                />
                <p>No classes found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {meetingData?.last_page && meetingData?.last_page > 1 && (
            <div className={styles.paginationFooter}>
              <span className={styles.pageInfo}>
                Showing {filteredMeetings.length} of {meetingData?.total || 0}{" "}
                classes
              </span>
              <div className={styles.pageControls}>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isPlaceholderData}
                >
                  Previous
                </button>
                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    className={page === p ? styles.activePage : ""}
                    onClick={() => handlePageChange(p)}
                    disabled={isPlaceholderData}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === meetingData.last_page || isPlaceholderData}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
