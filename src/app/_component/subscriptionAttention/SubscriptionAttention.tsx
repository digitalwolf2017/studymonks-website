import React, { useMemo } from "react";
import styles from "./SubscriptionAttention.module.scss";
import Link from "next/link";
import { useGetSubscriptionAlert } from "@/services/subscriptionPlanServices"; // Adjust path as needed

const SubscriptionAttention = () => {
  // 1. Call the custom hook
  const { data, isLoading, error } = useGetSubscriptionAlert();

  // 2. Calculate visibility and format date using useMemo (prevents re-calc on every render)
  const alertInfo = useMemo(() => {
    // If loading, error, or no date provided, return null
    if (isLoading || error || !data?.end_date) return null;

    const endDate = new Date(data.end_date);
    const today = new Date();

    // Calculate difference in milliseconds
    const diffTime = endDate.getTime() - today.getTime();

    // Convert to days (rounding up)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // LOGIC: Show if 10 days or less remaining AND the date hasn't passed substantially
    // Adjust logic if you want to show it even after expiry
    const showBanner = diffDays <= 10 && diffDays >= 0;

    if (!showBanner) return null;

    // Format the date (e.g., "31st August 2025")
    const formattedDate = endDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return { formattedDate };
  }, [data, isLoading, error]);

  // 3. Render nothing if conditions aren't met
  if (!alertInfo) {
    return null;
  }

  return (
    <div className={styles.infoWrapper}>
      <div className={styles.contentWrapper}>
        <span className={styles.label}>Attention:</span>
        <span className={styles.message}>
          Your subscription is going to expire for stage-8 on{" "}
          {alertInfo.formattedDate}.
        </span>
        <Link href={"/subscription"} className={styles.renewBtn}>
          Renew Now
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionAttention;
