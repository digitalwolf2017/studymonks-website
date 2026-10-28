import type { Metadata } from "next";
import MyAccountClient from "./myAccount.client";

export const metadata: Metadata = {
  title: "My Account | Study Monk Student Portal",
  description: "View and edit your Study Monk student profile",
};

export default function MyAccountPage() {
  return <MyAccountClient />;
}

