"use client";
import React from "react";
import styles from "./mySubscription.module.scss";
import { Check } from "lucide-react";
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";

export default function MySubscriptionClient() {
  const currentPlan = {
    name: "Pro Plan",
    price: "$29/mo",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    features: [
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
    ],
  };

  const previousPlans = [
    {
      name: "Basic Plan",
      startDate: "2023-01-10",
      endDate: "2024-01-10",
      price: "$9/mo",
    },
    {
      name: "Starter Plan",
      startDate: "2022-01-05",
      endDate: "2023-01-05",
      price: "$5/mo",
    },
  ];

  const availablePlans = [
    {
      name: "Basic",
      price: "$10/mo",
      startDate: "2025-01-01",
      duration: "1 year",
      features: ["Feature A", "Feature B", "Feature C", "Feature D"],
    },
    {
      name: "Pro",
      price: "$20/mo",
      startDate: "2025-01-01",
      duration: "6 months",
      features: ["Feature A", "Feature B", "Feature C", "Feature D"],
    },
    {
      name: "Premium",
      price: "$30/mo",
      startDate: "2025-01-01",
      duration: "1 year 6 months",
      features: ["Feature A", "Feature B", "Feature C", "Feature D"],
    },
  ];

  return (
    <div className={styles.innerWrapper}>
      <div className={styles.innerContainer}>
        <SubscriptionAttention />

        <h1 className="sectionHeading mb-6">My Subscription</h1>

        {/* Current Plan */}

        <div className={styles.subscriptionCont}>
          <div className={styles.currentCard}>
            <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
            <div className={`${styles.planCarad} ${styles.activeCard}`}>
              <h3 className={styles.planName}>{currentPlan.name}</h3>
              <p className={styles.priceText}>{currentPlan.price}</p>

              <div className={styles.dateWrap}>
                <p>
                  Start Date: <strong>{currentPlan.startDate}</strong>
                </p>
                <p>
                  End Date: <strong>{currentPlan.endDate}</strong>
                </p>
              </div>

              <ul className={styles.featuresWrap}>
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.previousWrap}>
            <h2>Previous Plans</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Plan</th>
                    <th className="p-3 border">Start Date</th>
                    <th className="p-3 border">End Date</th>
                    <th className="p-3 border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {previousPlans.map((plan, idx) => (
                    <tr key={idx} className="border">
                      <td className="p-3 border">{plan.name}</td>
                      <td className="p-3 border">{plan.startDate}</td>
                      <td className="p-3 border">{plan.endDate}</td>
                      <td className="p-3 border">{plan.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.smilierWrap}>
          <h2 className="sectionHeading">Available Plans</h2>

          <div className={styles.cradWrapper}>
            {availablePlans.slice(0, 3).map((plan, idx) => (
              <div className={styles.planCarad} key={idx}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.priceText}>{plan.price}</p>

                <div className={styles.dateWrap}>
                  <p>
                    Validity: <strong>{plan.duration}</strong>
                  </p>
                </div>

                <ul className={styles.featuresWrap}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check /> {feature}
                    </li>
                  ))}
                </ul>

                <div className={styles.btnWrap}>
                  <button className="button">Upgrade</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
