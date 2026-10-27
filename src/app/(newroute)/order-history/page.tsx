"use client";

import React, { useState } from "react";
import styles from "./orderHistory.module.scss";
import Header from "@/app/_component/header/NewHeaderCard";
import Image from "next/image";
import {
  useGetOrders,
  useGetOrderDetails,
} from "@/services/subscriptionPlanServices";
import { Order, OrderItem } from "@/models/subscriptionPlan";

// --- HELPERS ---
const getStatusConfig = (status: number) => {
  switch (status) {
    case 0:
      return {
        label: "Pending",
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fcd34d",
      }; // Amber
    case 1:
      return {
        label: "On Hold",
        color: "#3b82f6",
        bg: "#eff6ff",
        border: "#bfdbfe",
      }; // Blue
    case 2:
      return {
        label: "Paid",
        color: "#10b981",
        bg: "#ecfdf5",
        border: "#a7f3d0",
      }; // Emerald
    case 3:
      return {
        label: "Failed",
        color: "#ef4444",
        bg: "#fef2f2",
        border: "#fecaca",
      }; // Red
    case 4:
      return {
        label: "Cancelled",
        color: "#6b7280",
        bg: "#f9fafb",
        border: "#e5e7eb",
      }; // Gray
    case 5:
      return {
        label: "Partial Refund",
        color: "#8b5cf6",
        bg: "#f5f3ff",
        border: "#ddd6fe",
      }; // Violet
    case 6:
      return {
        label: "Full Refund",
        color: "#b91c1c",
        bg: "#fef2f2",
        border: "#fecaca",
      }; // Dark Red
    default:
      return {
        label: "Unknown",
        color: "#6b7280",
        bg: "#f9fafb",
        border: "#e5e7eb",
      };
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- SUB COMPONENT: Card with Dropdown ---
const OrderHistoryCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch details ONLY if this card is open
  const { data: detailsRes, isLoading } = useGetOrderDetails(
    isOpen ? order.id : null
  );

  const detailedData = detailsRes?.data;
  const detailedOrder: Order = Array.isArray(detailedData)
    ? detailedData[0]
    : detailedData || order;
  const items = detailedOrder.order_items || [];

  const statusConfig = getStatusConfig(order.status);

  return (
    <div
      className={`${styles.orderCard} ${isOpen ? styles.open : ""}`}
      style={{ borderLeftColor: statusConfig.color }}
    >
      {/* --- HEADER --- */}
      <div className={styles.cardHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.leftSection}>
          <div className={styles.iconBox}>
            <Image
              src="/assets/images/bill.svg"
              width={24}
              height={24}
              alt="Order"
            />
          </div>
          <div className={styles.texts}>
            <h4>{order.order_number || `Order #${order.id}`}</h4>
            <span className={styles.date}>{formatDate(order.created_at)}</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.priceTag}>
            <span className={styles.label}>Total</span>
            <span className={styles.value}>
              ₹{order.discounted_total_price}
            </span>
          </div>
          <span
            className={styles.statusBadge}
            style={{
              color: statusConfig.color,
              backgroundColor: statusConfig.bg,
              borderColor: statusConfig.border,
            }}
          >
            {statusConfig.label}
          </span>
          <div className={styles.toggleWrapper}>
            <Image
              src="/assets/images/drop-arrow.svg"
              width={12}
              height={12}
              alt="toggle"
              className={styles.toggleIcon}
            />
          </div>
        </div>
      </div>

      {/* --- DETAILS BODY --- */}
      <div
        className={styles.cardContentWrapper}
        style={{ maxHeight: isOpen ? "1000px" : "0px" }}
      >
        <div className={styles.cardDetails}>
          <div className={styles.divider}></div>

          {isLoading ? (
            <div className={styles.loadingBox}>
              <div className={styles.spinner}></div>
              <span>Loading details...</span>
            </div>
          ) : (
            <div className={styles.detailsContainer}>
              {/* 1. Transaction Info Grid */}
              <div className={styles.gridBox}>
                <div className={styles.detailItem}>
                  <label>Order ID</label>
                  <p>{detailedOrder.order_id || "N/A"}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Payment ID</label>
                  <p>{detailedOrder.payment_id || "Pending"}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Date</label>
                  <p>{formatDate(detailedOrder.created_at)}</p>
                </div>
                <div className={styles.detailItem}>
                  <label>Payment Method</label>
                  <p>
                    {detailedOrder.payment_method === 1 ? "Online" : "Offline"}
                  </p>
                </div>
                {/* <div className={styles.detailItem}>
                  <label>Class Room ID</label>
                  <p>{detailedOrder.class_room_id}</p>
                </div> */}
              </div>

              {/* 2. Purchased Items List */}
              <div className={styles.itemsSection}>
                <h3 className={styles.detailsHeading}>
                  Items in this Order ({items.length})
                </h3>

                {items.length > 0 ? (
                  <div className={styles.itemsList}>
                    {items.map((item: OrderItem) => {
                      const plan = item.subscription_plan;
                      const title =
                        plan?.batch?.title ||
                        plan?.subject?.title ||
                        "Subscription Plan";
                      const className = plan?.class?.title || "Class N/A";
                      const subjectName = plan?.subject?.title;

                      return (
                        <div key={item.id} className={styles.itemRow}>
                          <div className={styles.itemInfo}>
                            <p className={styles.itemTitle}>{title}</p>
                            <span className={styles.itemSub}>
                              {className}{" "}
                              {subjectName ? `• ${subjectName}` : ""}
                            </span>
                          </div>
                          <div className={styles.itemPrice}>
                            {item.refund_id && (
                              <span className={styles.refundBadge}>
                                Refunded
                              </span>
                            )}
                            <span>₹{item.total_discounted_price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.noItems}>
                    No item details available.
                  </div>
                )}
              </div>

              {/* 3. Global Refund Info */}
              {(detailedOrder.status === 5 || detailedOrder.status === 6) && (
                <div className={styles.refundBox}>
                  <div className={styles.refundHeader}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <polyline points="1 20 1 14 7 14"></polyline>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <h4>Refund Processed</h4>
                  </div>
                  <div className={styles.refundRow}>
                    <span className={styles.label}>Refund ID:</span>
                    <span className={styles.val}>
                      {detailedOrder.refund_id || "N/A"}
                    </span>
                  </div>
                  <div className={styles.refundRow}>
                    <span className={styles.label}>Amount:</span>
                    <span className={styles.valAmount}>
                      - ₹{detailedOrder.total_refund_price}
                    </span>
                  </div>
                </div>
              )}

              {/* 4. Total Breakdown */}
              <h3 className={styles.detailsHeading} style={{ marginTop: 25 }}>
                Payment Breakdown
              </h3>
              <div className={styles.paymentSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{detailedOrder.total_price}</span>
                </div>
                {(detailedOrder.total_price || 0) -
                  (detailedOrder.discounted_total_price || 0) >
                  0 && (
                  <div className={`${styles.summaryRow} ${styles.discount}`}>
                    <span>Discount Applied</span>
                    <span>
                      - ₹
                      {(detailedOrder.total_price || 0) -
                        (detailedOrder.discounted_total_price || 0)}
                    </span>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Paid Amount</span>
                  <span>₹{detailedOrder.discounted_total_price}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function OrderHistory() {
  const [filter, setFilter] = useState<"ALL" | "PAID" | "REFUND" | "FAILED">(
    "ALL"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: orderRes, isLoading } = useGetOrders();
  const orders = orderRes?.data || [];

  const filteredOrders = orders
    .filter((order: Order) => {
      if (filter === "ALL") return true;
      if (filter === "PAID") return order.status === 2;
      if (filter === "REFUND") return order.status === 5 || order.status === 6;
      if (filter === "FAILED") return [0, 1, 3, 4].includes(order.status);
      return true;
    })
    .sort(
      (a: Order, b: Order) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const handleFilterChange = (
    newFilter: "ALL" | "PAID" | "REFUND" | "FAILED"
  ) => {
    setFilter(newFilter);
    setIsFilterOpen(false);
  };

  return (
    <div className="mainBody">
      <Header />
      <div className="mainContainer">
        <div className={`container ${styles.historyPage}`}>
          {/* TOP BAR */}
          <div className={styles.topBar}>
            <div>
              <h1 className="sectionHeading">Order History</h1>
              <p className={styles.subHeading}>
                View and track your recent transactions.
              </p>
            </div>

            <div className={styles.filterDropDown}>
              <button
                className={styles.filterBtn}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <span>
                  Filter: {filter.charAt(0) + filter.slice(1).toLowerCase()}
                </span>
                <Image
                  src="/assets/images/drop-arrow.svg"
                  width={12}
                  height={12}
                  alt="arrow"
                  style={{
                    transform: isFilterOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              <div
                className={`${styles.dropList} ${
                  isFilterOpen ? styles.show : ""
                }`}
              >
                <button
                  className={filter === "ALL" ? styles.active : ""}
                  onClick={() => handleFilterChange("ALL")}
                >
                  All
                </button>
                <button
                  className={filter === "PAID" ? styles.active : ""}
                  onClick={() => handleFilterChange("PAID")}
                >
                  Paid
                </button>
                <button
                  className={filter === "REFUND" ? styles.active : ""}
                  onClick={() => handleFilterChange("REFUND")}
                >
                  Refunds
                </button>
                <button
                  className={filter === "FAILED" ? styles.active : ""}
                  onClick={() => handleFilterChange("FAILED")}
                >
                  Pending/Failed
                </button>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className={styles.orderList}>
            {isLoading && (
              <div className={styles.pageLoading}>
                <div className={styles.spinner}></div>
                <p>Loading orders...</p>
              </div>
            )}

            {!isLoading && filteredOrders.length > 0
              ? filteredOrders.map((order: Order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))
              : !isLoading && (
                  <div className={styles.emptyState}>
                    <Image
                      src="/assets/images/note-circle.svg"
                      width={60}
                      height={60}
                      alt="empty"
                      style={{ opacity: 0.2, marginBottom: "15px" }}
                    />
                    <p>No orders found.</p>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}
