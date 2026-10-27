"use client";

import { AuthProvider } from "@/auth/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../../src/queryClient";
import { ToastContainer } from "react-toastify";
import Script from "next/script";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Razorpay – loads once, client-only */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        {children}

        {/* Toasts */}
        <ToastContainer
          autoClose={false}
          theme="colored"
          position="top-center"
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
