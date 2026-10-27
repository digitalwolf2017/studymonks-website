import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "../_styles/global.scss";
import SubscriptionAttention from "../_component/subscriptionAttention/SubscriptionAttention";
import Script from "next/script";
import NewHeaderCard from "../_component/header/NewHeaderCard";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Study Monk",
  description: "Learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mainBody">
      <NewHeaderCard />
      <div className="mainContainer">{children}</div>
    </main>
  );
}
