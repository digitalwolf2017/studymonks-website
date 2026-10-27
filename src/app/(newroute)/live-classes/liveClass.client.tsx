"use client";
import React, { useMemo, useState, useEffect } from "react";
import styles from "./liveClass.module.scss";
import SubjectCard from "@/app/_component/subjectCard/SubjectCard";
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import Image from "next/image";
import Link from "next/link";
import {
  useGetMeetingDetails,
  useLiveClasses,
} from "@/services/liveClassesService";
import { formatDateForApi, formatDisplayDateTime } from "@/utilities/formatter";

export default function LiveClassClient() {
  //state decalaration
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeChild, setActiveChild] = useState("Overview");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  // --- API 1: Fetch Dashboard (Schedule + Subjects) ---
  const {
    mutate: fetchLiveClasses,
    data: dashboardResponse,
    isPending: isDashboardLoading,
  } = useLiveClasses();

  // --- API 2: Fetch Meeting Details ---
  const { data: meetingDetailsResponse, isLoading: isMeetingLoading } =
    useGetMeetingDetails(selectedScheduleId);

  const liveSubjects = dashboardResponse?.data?.live_classes_subjects || [];
  const scheduleList = dashboardResponse?.data?.live_classes_schedule || [];
  const meetingDetails = meetingDetailsResponse?.data;

  console.log("meeting details", meetingDetails);
  // --- Effect: Fetch Dashboard when Date Changes ---
  useEffect(() => {
    const apiDate = formatDateForApi(selectedDate);
    fetchLiveClasses({ date: apiDate });
  }, [selectedDate, fetchLiveClasses]);

  // --- Effect: Auto-select first item when schedule loads ---
  useEffect(() => {
    if (scheduleList.length > 0) {
      // If we don't have a selected ID yet, or the current selected ID isn't in the new list
      const exists = scheduleList.find((i) => i.id === selectedScheduleId);
      if (!selectedScheduleId || !exists) {
        setSelectedScheduleId(scheduleList[0].id);
      }
    } else {
      setSelectedScheduleId(null);
    }
  }, [dashboardResponse]); // Run when dashboard data updates

  const total = 15;
  const centerIndex = Math.floor(total / 2);

  const [activeParent, setActiveParent] = useState(0);

  //calender

  const TOTAL = 15;
  const MID = Math.floor(TOTAL / 2);
  const [center, setCenter] = useState(new Date());

  const days = useMemo(() => {
    const arr = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [selectedDate]);

  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() - 1);
    setSelectedDate(d);
  };

  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() + 1);
    setSelectedDate(d);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // --- Filtering Live Works ---
  const classWorks =
    meetingDetails?.live_works?.filter((work) => work.type === 1) || [];
  const homeWorks =
    meetingDetails?.live_works?.filter((work) => work.type === 2) || [];

  return (
    <div className={styles.innerWrapper}>
      <div className={styles.liveClassWrapper}>
        <SubscriptionAttention />

        <div className={styles.liveClassMainWrap}>
          <h2 className="sectionHeading">Live Classes Schedule</h2>
          <div className={styles.classWrapper}>
            <div className={styles.schduleCardWrap}>
              <div className={styles.wrap}>
                <button
                  onClick={prevDay}
                  className={`${styles.navBtn} ${styles.left}`}
                >
                  ◀
                </button>

                {/* left side calender */}
                <div className={styles.calenderWrap}>
                  <div className={styles.calenderCont}>
                    {days.map((date, i) => {
                      const isCenter = i === MID;

                      // Compare dates ignoring time to set active class strictly by day
                      const isActive =
                        date.toDateString() === selectedDate.toDateString();

                      return (
                        <button
                          key={i}
                          onClick={() => handleDateClick(date)}
                          className={`${styles.calenderCard} ${
                            isCenter ? styles.active : ""
                          }`}
                        >
                          <h2>{date.getDate()}</h2>
                          <h3>
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </h3>
                          <div className={styles.circleWrap}>
                            <div className={styles.blue}></div>
                            <div className={styles.red}></div>
                            <div className={styles.white}></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={nextDay}
                  className={`${styles.navBtn} ${styles.right}`}
                >
                  ▶
                </button>
              </div>

              {/* Schedule List */}
              <div className={styles.schduleList}>
                {isDashboardLoading ? (
                  <p>Loading Schedule...</p>
                ) : scheduleList.length > 0 ? (
                  scheduleList.map((item, index) => (
                    <button
                      key={item.id}
                      className={`listCard ${
                        selectedScheduleId === item.id ? "cardActive" : ""
                      }`}
                      onClick={() => setSelectedScheduleId(item.id)}
                    >
                      <Image
                        src={"/assets/images/list-icon.svg"}
                        width={40}
                        height={40}
                        alt="icon"
                        className="cardIcon"
                      />
                      <div className="cardText">
                        <h3>{item.topic}</h3>
                        <p>
                          {item.subject.title} :{" "}
                          {formatDisplayDateTime(item.start_time)}
                        </p>
                      </div>
                      {selectedScheduleId === item.id && (
                        <Image
                          src={"/assets/images/check-green.svg"}
                          width={16}
                          height={16}
                          alt="icon"
                          className="checkIcon"
                        />
                      )}

                      {/* Status Icon could be dynamic based on status
                      {item.status === 2 ? (
                        <Image
                          src={"/assets/images/check-green.svg"}
                          width={16}
                          height={16}
                          alt="done"
                          className="checkIcon"
                        />
                      ) : item.status === 1 ? (
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                          className="checkIcon"
                        /> // Simple red dot for live
                      ) : null} */}
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <p>No live schedule for today</p>
                  </div>
                )}
              </div>
            </div>

            {/* --- RIGHT SIDE: Details Tab --- */}
            <div className={styles.schduleTabWrap}>
              {/* Show details only if a schedule is selected */}
              {selectedScheduleId && meetingDetails ? (
                <div className={styles.tabWrapper}>
                  {/* HEADER */}
                  <div className={styles.tabHead}>
                    <div className={styles.headInfo}>
                      <h3>{meetingDetails.topic}</h3>
                      <p>
                        {meetingDetails.subject.title} :{" "}
                        {formatDisplayDateTime(meetingDetails.start_time)}
                      </p>
                    </div>
                    <div className={styles.headBtn}>
                      {/* Badge Logic */}
                      {meetingDetails.status === 0 && (
                        <span className="buttonSm yellowBtn">Upcoming</span>
                      )}
                      {meetingDetails.status === 1 && (
                        <span
                          className="buttonSm redBtn"
                          style={{
                            backgroundColor: "#ffeded",
                            color: "red",
                            border: "1px solid red",
                          }}
                        >
                          Live Now
                        </span>
                      )}
                      {meetingDetails.status === 2 && (
                        <span className="buttonSm greenBtn">Completed</span>
                      )}
                    </div>
                  </div>

                  {/* CHILD TABS */}
                  <div className={styles.tabBody}>
                    <div className={styles.tabSmWrap}>
                      <div className={styles.tabSmHead}>
                        <button
                          className={
                            activeChild === "Overview" ? styles.activeSm : ""
                          }
                          onClick={() => setActiveChild("Overview")}
                        >
                          Overview
                        </button>
                        <button
                          className={
                            activeChild === "Class Work" ? styles.activeSm : ""
                          }
                          onClick={() => setActiveChild("Class Work")}
                        >
                          Class Work
                        </button>
                        <button
                          className={
                            activeChild === "Home Work" ? styles.activeSm : ""
                          }
                          onClick={() => setActiveChild("Home Work")}
                        >
                          Home Work
                        </button>
                      </div>

                      {/* CHILD TAB CONTENT */}
                      <div className={styles.tabSmBody}>
                        {isMeetingLoading ? (
                          <p>Loading Details...</p>
                        ) : (
                          <>
                            {/* Overview */}
                            {activeChild === "Overview" && (
                              <div className={styles.overviewInfo}>
                                <div className={styles.setailsInfo}>
                                  <h3>Session Details</h3>
                                  <p>
                                    {meetingDetails.agenda ||
                                      "No description available for this session."}
                                  </p>
                                </div>
                                <div className={styles.tabFooter}>
                                  {/* STATUS 2: Completed -> Watch Recording */}
                                  {meetingDetails.status === 2 &&
                                    meetingDetails.vod_output && (
                                      <Link
                                        href={`/video-player?url=${encodeURIComponent(
                                          meetingDetails.vod_output
                                        )}`}
                                        className="button"
                                      >
                                        <Image
                                          src={"/assets/images/video.svg"}
                                          width={20}
                                          height={20}
                                          alt="icon"
                                        />
                                        Watch Recording
                                      </Link>
                                    )}

                                  {/* STATUS 1: Started -> Join Live */}
                                  {meetingDetails.status === 1 &&
                                    meetingDetails.join_url && (
                                      <Link
                                        href={`/live/${meetingDetails.id}`}
                                        className="button greenBtn"
                                      >
                                        <Image
                                          src={"/assets/images/video.svg"}
                                          width={20}
                                          height={20}
                                          alt="icon"
                                        />
                                        Join Live Class
                                      </Link>
                                    )}

                                  {/* STATUS 0: Upcoming -> Info Text or Disabled Button */}
                                  {/* {meetingDetails.status === 0 && (
                                    <button
                                      className="button"
                                      disabled
                                      style={{
                                        opacity: 0.6,
                                        cursor: "not-allowed",
                                      }}
                                    >
                                      <Image
                                        src={"/assets/images/video.svg"}
                                        width={20}
                                        height={20}
                                        alt="icon"
                                      />
                                      Class starts soon
                                    </button>
                                  )} */}

                                  {meetingDetails.status === 2 && (
                                    <Link
                                      href={`/recorded-classess/${meetingDetails.id}`}
                                      className="button"
                                    >
                                      <Image
                                        src={"/assets/images/video.svg"}
                                        width={20}
                                        height={20}
                                        alt="icon"
                                      />
                                      Watch Recording
                                    </Link>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* CLASS WORK TAB (Type == 1) */}
                            {activeChild === "Class Work" && (
                              <div className={styles.classworkInfo}>
                                {classWorks.length > 0 ? (
                                  classWorks.map((work) => (
                                    <Link
                                      key={work.id}
                                      href={`/live-work/${meetingDetails.id}/${work.id}`}
                                      className="listCard linkRow"
                                    >
                                      <Image
                                        src="/assets/images/note-circle.svg"
                                        width={40}
                                        height={40}
                                        alt="icon"
                                        className="cardIcon"
                                      />
                                      <div className="cardText">
                                        <h3>{work.title}</h3>
                                        <p>
                                          {formatDisplayDateTime(
                                            meetingDetails.start_time
                                          )}
                                        </p>
                                      </div>
                                      <Image
                                        src="/assets/images/link-icon.svg"
                                        width={16}
                                        height={16}
                                        alt="icon"
                                        className="checkIcon"
                                      />
                                    </Link>
                                  ))
                                ) : (
                                  <p style={{ color: "#666" }}>
                                    No Class Work available.
                                  </p>
                                )}
                              </div>
                            )}

                            {/* HOME WORK TAB (Type == 2) */}
                            {activeChild === "Home Work" && (
                              <div className={styles.homeworkInfo}>
                                {homeWorks.length > 0 ? (
                                  homeWorks.map((work) => (
                                    <Link
                                      key={work.id}
                                      href={`/live-work/${meetingDetails.id}/${work.id}`}
                                      className="listCard linkRow"
                                    >
                                      <Image
                                        src="/assets/images/note-circle.svg"
                                        width={40}
                                        height={40}
                                        alt="icon"
                                        className="cardIcon"
                                      />
                                      <div className="cardText">
                                        <h3>{work.title}</h3>
                                        <p>
                                          {formatDisplayDateTime(
                                            meetingDetails.start_time
                                          )}
                                        </p>
                                      </div>
                                      <Image
                                        src="/assets/images/link-icon.svg"
                                        width={16}
                                        height={16}
                                        alt="icon"
                                        className="checkIcon"
                                      />
                                    </Link>
                                  ))
                                ) : (
                                  <p style={{ color: "#666" }}>
                                    No Home Work available.
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Empty state for Right Panel
                <div
                  className={styles.schduleTabWrap}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "300px",
                    background: "#fff",
                    borderRadius: "12px",
                  }}
                >
                  <p style={{ color: "#888" }}>
                    Select a class from the schedule to view details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject Row */}
        <div className="subjectRow">
          <h2 className="sectionHeading">Live Classes Subjects</h2>

          {isDashboardLoading ? (
            <p>Loading subjects...</p>
          ) : (
            <div className="subjectCont">
              {liveSubjects.length > 0 ? (
                liveSubjects.map((subject, index) => {
                  // 👇 LOGIC FIX: Extract the first batch ID
                  const firstBatchId = subject.batches?.[0]?.id;

                  // If a batch exists, link to it. Otherwise, use '#' or disable.
                  const cardLink = firstBatchId
                    ? `/recorded-dashboard/${firstBatchId}`
                    : "#";

                  return (
                    <SubjectCard
                      key={subject.id}
                      title={subject.title}
                      classes={subject.live_classes_count || 0}
                      image={subject.image_url || "/assets/images/img-1.jpg"}
                      link={cardLink}
                      isPaid={subject.is_paid === 1}
                    />
                  );
                })
              ) : (
                <p>No subjects found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
