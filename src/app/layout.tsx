import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";

// import BootstrapClient from "../app/BootstrapClient";
import ClientLayout from "./ClientLayout";

// Fonts config
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unleash Confidence & Focus in Cambridge Learning",
  description:
    "Join Study Monks — where expert mentors ignite your child’s voice and guide them confidently through the Cambridge path to mastery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="global">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
