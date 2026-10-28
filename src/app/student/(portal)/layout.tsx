import type { Metadata } from "next";
import "@/app/_styles/global.scss";
import NewHeaderCard from "@/app/_component/header/NewHeaderCard";

export const metadata: Metadata = {
  title: "Student Portal | Study Monk",
  description: "Study Monk Student Portal",
};

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mainBody">
      <NewHeaderCard />
      <div className="mainContainer">{children}</div>
    </main>
  );
}

