"use client";
import React from "react";
import styles from "./live.module.scss";
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import VideoContainer from "@/app/_component/video/video";

export default function LiveClient({ slug }: { slug: string }) {
  const classId = Number(slug);

  return (
    <div className={styles.pageInner}>
      <div className={styles.pageCont}>
        <SubscriptionAttention />
        <h1 className={styles.sectionHeading}>
          Live Class: <span>{slug}</span>
        </h1>
        <div className={styles.videoCont}>
          <VideoContainer classId={classId} />
        </div>
      </div>
    </div>
  );
}
