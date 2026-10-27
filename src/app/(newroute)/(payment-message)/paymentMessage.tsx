"use client";

import React, { useEffect, useState } from "react";
import styles from "./paymentMessage.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
// Import the Hook AND the Type from your service
import {
  useGetOrderDetailsId,
  OrderData,
} from "@/services/subscriptionPlanServices";

type PaymentMessageProps = {
  status: "success" | "failed";
};

export default function PaymentMessage({ status }: PaymentMessageProps) {
  const params = useParams();
  const paymentOrderId = params?.id as string;

  // 2. Pass ID to your service hook
  const { data: orderRes } = useGetOrderDetailsId(paymentOrderId);

  // 2. Update State type to OrderData
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (orderRes?.success) {
      setOrder(orderRes.data);
    }
  }, [orderRes]);

  // 3. Map the fields correctly based on the new API response
  const paymentId = order?.payment_id ?? "-";
  const orderId = order?.order_id ?? "-";

  // Use discounted_total_price if available
  const amount = order?.discounted_total_price
    ? `₹${order.discounted_total_price}`
    : order?.total_price
    ? `₹${order.total_price}`
    : "-";

  const invoice = order?.order_number ?? "-";

  return (
    <div className={styles.paymentPage}>
      {/* SUCCESS MESSAGE */}
      {status === "success" ? (
        <div className={`${styles.messagecard} ${styles.successMessage}`}>
          <div className={styles.card}>
            <div className={styles.icon}>
              <Image
                src="/assets/images/check.svg" // Ensure leading slash for absolute path
                width={80}
                height={80}
                alt="success"
              />
            </div>

            <h1>Payment Successful</h1>
            <p>Your payment has been processed successfully.</p>

            <div className={styles.details}>
              <div>
                <span>Invoice No</span>
                <span>{invoice}</span>
              </div>
              <div>
                <span>Order ID</span>
                <span>{orderId}</span>
              </div>
              <div>
                <span>Payment ID</span>
                <span>{paymentId}</span>
              </div>
              <div>
                <span>Total Paid</span>
                <span>{amount}</span>
              </div>
            </div>

            <div className={styles.btnDiv}>
              <Link href="/dashboard" className="button">
                Go to Dashboard
              </Link>
            </div>
            <div className={styles.btnDiv}>
              <Link href="/order-history" className="button">
                Order History
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* FAILED MESSAGE */
        <div className={`${styles.messagecard} ${styles.faildMessage}`}>
          <div className={styles.card}>
            <div className={styles.icon}>
              <Image
                src="/assets/images/mark.svg" // Ensure leading slash
                width={80}
                height={80}
                alt="failed"
              />
            </div>

            <h1>Payment Failed</h1>
            <p>
              Don’t worry—if you need any help, please contact us and our
              support team will assist you shortly.
            </p>

            <div className={styles.btnDiv}>
              <Link href="/" className="button">
                Back To Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
