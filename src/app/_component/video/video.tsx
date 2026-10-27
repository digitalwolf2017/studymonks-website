import React from "react";
import styles from "./video.module.scss";
import { API_BASE_URL } from "@/models/base";

type Props = {
  classId: number; // e.g. course item id
  /*   meetingNumber: string;      // digits only
    passcode?: string;
    displayName: string;
    leaveUrl:string;
    tokenUrl: string; */ // e.g. `${API_BASE_URL}/api/course-items/jointoken/` (we will call tokenUrl + classId)
  height?: number | string; // iframe height (default 100vh)
};

export default function VideoContainer({ classId, height = "100vh" }: Props) {
  const bearer =
    typeof window !== "undefined"
      ? localStorage.getItem("study_monk_token")
      : null;

  if (!bearer) return <div>Not Authenticated</div>;

  return (
    <div className={styles.videoWrapper}>
      <iframe
        src={
          //   "https://app.tutopiapro.com/live?id=" + classId + "&token=" + bearer
          `${API_BASE_URL}zoom-live?id=${classId}&token=${bearer}`
        }
        allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write"
        style={{
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          border: 0,
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
