"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./subscription.module.scss";
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import Image from "next/image";

import {
  useGetSubscriptionPlans,
  useGetCartItems,
  useCreateCartItem,
  useDeleteCartItem,
} from "@/services/subscriptionPlanServices";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/models/base";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";

// export const PAYMENT_SUCCESS_URL = "http://localhost:3000/payment-success";
// export const PAYMENT_FAILED_URL  = "http://localhost:3000/payment-failed";

const PAYMENT_SUCCESS_URL = "../payment-success";
const PAYMENT_FAILED_URL = "../payment-failed";

export default function SubscriptionClient() {
  const router = useRouter();
  const { token } = useAuth();

  //  user
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("study_monk_user") || "{}")
      : null;

  //  plans
  const { getSubscriptionPlans } = useGetSubscriptionPlans();
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Payment loading state

  //  cart
  const { data: cartRes, refetch: refetchCart } = useGetCartItems();
  const createCartItem = useCreateCartItem();
  const { deleteCartItem } = useDeleteCartItem();

  const cartItems = cartRes?.data || [];

  //  tabs
  const [activeTab, setActiveTab] = useState("monthly");

  //  fetch plans
  useEffect(() => {
    getSubscriptionPlans.refetch().then((res: any) => {
      setPlans(res?.data?.data || []);
      setLoadingPlans(false);
    });
  }, []);

  //  helpers
  const isPurchased = (plan: any) => plan.order_item !== null;

  const isInCart = (planId: number) =>
    cartItems.some((item: any) => item.subscription_plan_id === planId);

  //  filtered plans
  const filteredPlans = useMemo(() => {
    if (activeTab === "annually") {
      return plans.filter((plan) => plan.duration === 365);
    }

    return plans.filter((plan) => plan.duration !== 365);
  }, [plans, activeTab]);

  //  add to cart
  const handleAddToCart = async (plan: any) => {
    if (!user?.id) return;

    await createCartItem.mutateAsync({
      user_id: user.id,
      subscription_plan_id: plan.id,
      quantity: 1,
    });

    refetchCart();
  };

  //  remove from cart
  const handleRemoveFromCart = async (cartItemId: number) => {
    await deleteCartItem(cartItemId);
    refetchCart();
  };

  //  totals
  const totals = useMemo(() => {
    let totalValue = 0;
    let totalPayable = 0;

    cartItems.forEach((item: any) => {
      totalValue += item.total_price;
      totalPayable += item.total_discounted_price;
    });

    return {
      totalValue,
      totalPayable,
      savings: totalValue - totalPayable,
    };
  }, [cartItems]);

  const isPayDisabled = totals.totalPayable === 0;

  // const handleApplyClick = async (e: React.MouseEvent) => {
  //   e.preventDefault();

  //   if (!isLoggedIn) {
  //     toast.error("Please login first!");
  //     localStorage.setItem("redirectURL", `/`);
  //     router.push("/login");
  //     return;
  //   }

  //   try {
  //     // 1️⃣ Create Razorpay order (Laravel API)
  //     const res = await fetch(`${API_BASE_URL}/api/v1/razorpay/create-order`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  // class_room_id. <--- save from local
  //         webinar_id: webinar.id,
  //         success_url: `${encodeURIComponent(PAYMENT_SUCCESS_URL)}`,
  //         failed_url: `${encodeURIComponent(PAYMENT_FAILED_URL)}`,
  //       }),
  //     });

  //     const order = await res.json();

  //     if (!order.order_id) {
  //       toast.error("Unable to initiate payment");
  //       return;
  //     }

  //     // 2️⃣ Open Razorpay Checkout
  //     const options = {
  //       key: order.key,
  //       amount: order.amount,
  //       currency: order.currency,
  //       name: order.name,
  //       description: order.description,
  //       order_id: order.order_id,
  //       prefill: order.prefill,

  //       handler: async function (response: any) {
  //         await verifyPayment(response);
  //       },

  //       modal: {
  //         ondismiss: () => {
  //           router.push(PAYMENT_FAILED_URL);
  //         },
  //       },

  //       theme: {
  //         color: "#0f172a",
  //       },
  //     };

  //     const razorpay = new (window as any).Razorpay(options);
  //     razorpay.open();
  //   } catch (err) {
  //     toast.error("Payment initiation failed");
  //   }
  // };

  // const verifyPayment = async (response: any) => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/razorpay/verify-payment`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(response),
  //     });
  //     const data = await res.json();

  //     if (data.success) {
  //       router.push(PAYMENT_SUCCESS_URL + "/" + data.data);
  //     } else {
  //       router.push(PAYMENT_FAILED_URL);
  //     }
  //   } catch {
  //     router.push(PAYMENT_FAILED_URL);
  //   }
  // };

  // --- PAYMENT LOGIC ---

  const verifyPayment = async (response: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}api/razorpay/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(response),
      });
      const data = await res.json();
      // console.log("data", data);
      if (data.success) {
        toast.success("Payment Successful!");
        // Clear cart locally or refetch
        refetchCart();
        console.log(
          "success url ",
          `/${PAYMENT_SUCCESS_URL}/${data.data || ""}`
        );
        router.push(`/${PAYMENT_SUCCESS_URL}/${data.data || ""}`);
      } else {
        toast.error("Payment verification failed");
        router.push(`/${PAYMENT_FAILED_URL}`);
      }
    } catch (error) {
      console.error("Verification Error", error);
      toast.error("Payment verification failed");
      router.push(`/${PAYMENT_FAILED_URL}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();

    console.log("Current Token:", token);

    if (!user || !token) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    // Identify Class Room ID
    const classRoomId = user.current_class_id || 0;

    if (!classRoomId) {
      toast.error("Classroom information missing. Please update your profile.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1️⃣ Create Razorpay order
      const res = await fetch(`${API_BASE_URL}api/v1/razorpay/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          class_room_id: classRoomId, // Extracted from local user
          // amount: totals.totalPayable, // Sending total just in case API needs validation
          // success_url: `${window.location.origin}/${PAYMENT_SUCCESS_URL}`,
          // failed_url: `${window.location.origin}/${PAYMENT_FAILED_URL}`,
        }),
      });

      const orderData = await res.json();

      if (!orderData.success || !orderData.order_id) {
        toast.error(orderData.message || "Unable to initiate payment");
        setIsProcessing(false);
        return;
      }

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: orderData.key, // Ensure your API returns the key or use env variable
        amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: orderData.currency,
        name: "Study Monk",
        description: "Subscription Payment",
        order_id: orderData.order_id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        handler: async function (response: any) {
          await verifyPayment(response);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
        theme: {
          color: "#0f172a",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Init Error", err);
      toast.error("Payment initiation failed");
      setIsProcessing(false);
    }
  };

  if (loadingPlans) {
    return <p>Loading subscriptions...</p>;
  }

  return (
    <div className={styles.innerWrapper}>
      <div className={styles.innerContainer}>
        <SubscriptionAttention />

        <div className={styles.subscriptionWrapper}>
          {/*    HEADER    */}
          <div className={styles.subscriptionOption}>
            <div className={styles.infoWrap}>
              <h1 className="sectionHeading">Subscription Plans</h1>
              <p>Choose the plan that's right for you.</p>
            </div>
          </div>

          <div className={styles.cardWrapper}>
            {/*    PLANS    */}
            <div className={styles.listCard}>
              <div className={styles.tabHead}>
                <button
                  className={activeTab === "monthly" ? styles.tabActive : ""}
                  onClick={() => setActiveTab("monthly")}
                >
                  Monthly
                </button>
                <span>|</span>
                <button
                  className={activeTab === "annually" ? styles.tabActive : ""}
                  onClick={() => setActiveTab("annually")}
                >
                  Annually
                </button>
              </div>

              <div className={styles.tabBody}>
                <div className={styles.tabcardHolder}>
                  {filteredPlans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`${styles.tabRow} ${
                        isInCart(plan.id) ? styles.selected : ""
                      }`}
                    >
                      <div className={styles.rowInfo}>
                        <h3>
                          {plan.subject.title} <span>({plan.class.title})</span>
                        </h3>

                        <p>{plan.batch.title}</p>

                        <p>
                          Duration: {plan.duration} days • Chapters:{" "}
                          {plan.subject.total_chapters}
                        </p>

                        <p>
                          Batch: {plan.batch.start_date} → {plan.batch.end_date}
                        </p>
                      </div>

                      <div className={styles.rowPrice}>
                        <h2>₹ {plan.price}</h2>

                        {isPurchased(plan) ? (
                          <Image
                            src="/assets/images/added.svg"
                            width={40}
                            height={40}
                            alt="ped"
                          />
                        ) : plan.active === 1 ? (
                          isInCart(plan.id) ? (
                            <Image
                              src={"assets/images/cart-added.svg"}
                              width={40}
                              height={40}
                              alt="icon"
                            />
                          ) : (
                            <button onClick={() => handleAddToCart(plan)}>
                              <Image
                                src="/assets/images/cart.svg"
                                width={40}
                                height={40}
                                alt="add"
                              />
                            </button>
                          )
                        ) : (
                          <span style={{ color: "red" }}>Inactive</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/*    CART    */}
            <div className={styles.billCard}>
              <h2>Cart Details</h2>

              <div className={styles.formList}>
                <div className={styles.billWrap}>
                  {cartItems.map((item: any) => (
                    <div className={styles.billRow} key={item.id}>
                      <div className={styles.billTag}>
                        <h3>
                          {item.subscription_plan.subject.title} –{" "}
                          {item.subscription_plan.batch.title}
                        </h3>
                        <p>{item.subscription_plan.duration} Days Access</p>
                      </div>

                      <div className={styles.priceWrap}>
                        <h3>₹ {item.total_discounted_price}</h3>
                        <p>₹ {item.total_price}</p>
                      </div>

                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <Image
                          src="/assets/images/minus.svg"
                          width={24}
                          height={24}
                          alt="remove"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.subDiv}>
                  <div className={styles.sumRow}>
                    <h3>Total Value</h3>
                    <h3>₹ {totals.totalValue}</h3>
                  </div>
                  <div className={`${styles.sumRow} ${styles.sumRowOffer}`}>
                    <h3>Your Savings</h3>
                    <h3>₹ {totals.savings}</h3>
                  </div>
                </div>

                <div className={styles.totalWrap}>
                  <h3>Total Payable</h3>
                  <h3>₹ {totals.totalPayable}</h3>
                </div>

                <div className={styles.buttonWrap}>
                  <button
                    className={styles.PayBtn}
                    onClick={handlePayment}
                    disabled={isPayDisabled}
                    style={{
                      opacity: isPayDisabled ? 0.5 : 1,
                      cursor: isPayDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
            {/*    CART END  */}
          </div>
        </div>
      </div>
    </div>
  );
}
