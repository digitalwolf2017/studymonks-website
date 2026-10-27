"use client";
import React, { useState, useMemo } from "react";
import styles from "./recordedClassess.module.scss"; // Keeping SCSS as is
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import VideoContainer from "@/app/_component/video/video";
import Image from "next/image";
import Link from "next/link";
import { useGetMeetingDetails } from "@/services/liveClassesService";
import WorkSubmission from "@/app/_component/workSubmission/WorkSubmission"; // Import your reusable component

interface RecordedClassessClientProps {
  meetingId: string; // The slug is effectively the meetingId here
}

export default function RecordedClassessClient({
  meetingId,
}: RecordedClassessClientProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState<
    "recorded" | "classwork" | "homework" | "summary"
  >("recorded");

  // State for nested tabs inside Homework/Classwork list vs details
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);

  // --- API Fetch ---
  const { data: apiResponse, isLoading } = useGetMeetingDetails(
    Number(meetingId)
  );
  const meetingData = apiResponse?.data;

  // --- Data Processing ---
  const classWorks = useMemo(() => {
    return (
      meetingData?.live_works?.filter((work: any) => work.type === 1) || []
    );
  }, [meetingData]);

  const homeWorks = useMemo(() => {
    return (
      meetingData?.live_works?.filter((work: any) => work.type === 2) || []
    );
  }, [meetingData]);

  // Find the selected work item object if an ID is selected
  const selectedWorkItem = useMemo(() => {
    if (!selectedWorkId || !meetingData?.live_works) return null;
    return meetingData.live_works.find((w: any) => w.id === selectedWorkId);
  }, [selectedWorkId, meetingData]);

  // --- Handlers ---
  const handleWorkClick = (workId: number) => {
    setSelectedWorkId(workId);
  };

  const handleBackToList = () => {
    setSelectedWorkId(null);
  };

  if (isLoading) {
    return (
      <div className={styles.pageInner}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!meetingData) {
    return (
      <div className={styles.pageInner}>
        <p>Class not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageInner}>
      <div className={styles.pageCont}>
        <SubscriptionAttention />

        {/* --- Header Section --- */}
        <div className={styles.detailsHead}>
          <h1 className="sectionHeading">
            Recorded Class: <span>{meetingData.topic}</span>
          </h1>
          <ul>
            <li>{meetingData.subject?.title}</li>
            <li>{meetingData.agenda || "No agenda description available."}</li>
          </ul>
        </div>

        <div className={styles.mianContainer}>
          {/* --- Tabs Header --- */}
          <div className={styles.tabHead}>
            <button
              className={activeTab === "recorded" ? styles.active : ""}
              onClick={() => {
                setActiveTab("recorded");
                setSelectedWorkId(null);
              }}
            >
              Recorded Video
            </button>

            <button
              className={activeTab === "classwork" ? styles.active : ""}
              onClick={() => {
                setActiveTab("classwork");
                setSelectedWorkId(null);
              }}
            >
              Class work
            </button>

            <button
              className={activeTab === "homework" ? styles.active : ""}
              onClick={() => {
                setActiveTab("homework");
                setSelectedWorkId(null);
              }}
            >
              Home work
            </button>

            <button
              className={activeTab === "summary" ? styles.active : ""}
              onClick={() => {
                setActiveTab("summary");
                setSelectedWorkId(null);
              }}
            >
              Summary
            </button>
          </div>

          {/* --- Tab Content --- */}
          <div className={styles.tabBody}>
            {/* 1. Recorded Video Tab */}
            {activeTab === "recorded" && (
              <div className={styles.tabHolder}>
                {meetingData.vod_output ? ( // yeha pr check krna ha danger h????
                  // Pass the URL to your VideoContainer
                  <VideoContainer classId={meetingData.id} />
                ) : (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <p>Recording is not available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Class Work Tab */}
            {activeTab === "classwork" && (
              <div className={styles.tabHolder}>
                {selectedWorkId && selectedWorkItem ? (
                  // Show the WorkSubmission Component
                  <div>
                    <button
                      onClick={handleBackToList}
                      className="buttonSm"
                      style={{
                        marginBottom: "15px",
                        background: "#eee",
                        color: "#333",
                      }}
                    >
                      ← Back to List
                    </button>
                    <WorkSubmission
                      workId={selectedWorkItem.id}
                      meetingId={Number(meetingId)}
                      title={selectedWorkItem.title}
                      type={1} // Class Work
                      pdfBase64={selectedWorkItem.pdf}
                      subTitle="Complete the worksheet"
                    />
                  </div>
                ) : (
                  // Show the List of Class Works
                  <div className={styles.classWrokListWrap}>
                    {classWorks.length > 0 ? (
                      classWorks.map((work: any) => (
                        <div
                          key={work.id}
                          className="listCard linkRow"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleWorkClick(work.id)}
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
                              Created:{" "}
                              {new Date(work.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Image
                            src="/assets/images/link-icon.svg"
                            width={16}
                            height={16}
                            alt="icon"
                            className="checkIcon"
                          />
                        </div>
                      ))
                    ) : (
                      <p style={{ padding: "20px" }}>
                        No class work available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. Home Work Tab */}
            {activeTab === "homework" && (
              <div className={styles.tabHolder}>
                {selectedWorkId && selectedWorkItem ? (
                  // Show the WorkSubmission Component
                  <div>
                    <button
                      onClick={handleBackToList}
                      className="buttonSm"
                      style={{
                        marginBottom: "15px",
                        background: "#eee",
                        color: "#333",
                      }}
                    >
                      ← Back to List
                    </button>
                    <WorkSubmission
                      workId={selectedWorkItem.id}
                      meetingId={Number(meetingId)}
                      title={selectedWorkItem.title}
                      type={2} // Home Work
                      pdfBase64={selectedWorkItem.pdf}
                      subTitle="Complete the homework"
                    />
                  </div>
                ) : (
                  // Show List
                  <div className={styles.homeWorkWrapper}>
                    <div className={styles.listWrap}>
                      {homeWorks.length > 0 ? (
                        homeWorks.map((work: any) => (
                          <div
                            key={work.id}
                            className="listCard"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleWorkClick(work.id)}
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
                              <p>Click to view and submit</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ padding: "20px" }}>
                          No home work available.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Summary Tab */}
            {activeTab === "summary" && (
              <div className={styles.tabHolder}>
                {/* Assuming you have a SummeryCard component. 
                    If the API doesn't have a specific 'summary' object but just a text field, 
                    you might need to adapt SummeryCard or render text directly.
                 */}
                <div
                  style={{
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "12px",
                  }}
                >
                  {meetingData.summary ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: meetingData.summary }}
                    />
                  ) : (
                    <p style={{ color: "#666" }}>
                      No summary available for this class.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
