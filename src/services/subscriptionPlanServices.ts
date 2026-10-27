import { api, useDelete, useGet, usePost } from "@/utilities/api";
import {
  Order,
  OrderHistoryResponse,
  SubscriptionPlan,
} from "@/models/subscriptionPlan";

export interface OrderData {
  id: number;
  uuid: string;
  user_id: number;
  class_room_id: number;
  status: number;
  payment_method: number;
  order_number: string; // Invoice No
  order_id: string;
  payment_id: string;
  total_price: number;
  discounted_total_price: number;
  created_at: string;
  updated_at: string;
  // You can include relations (user, class, order_items) if needed,
  // but they aren't strictly required for this view.
}

export interface OrderAPIResponse {
  success: boolean;
  data: OrderData;
}

export interface SubscriptionAlertResponse {
  end_date: string; // Format: "YYYY-MM-DD HH:mm:ss"
}

export const useGetSubscriptionPlans = () => {
  const getSubscriptionPlans = useGet<SubscriptionPlan, Error>(
    "api/v1/subscription-plans",
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    getSubscriptionPlans,
  };
};

/* CREATE CART ITEM */

export interface CreateCartPayload {
  user_id: number;
  subscription_plan_id: number;
  quantity: number;
}

export const useCreateCartItem = () => {
  return usePost<any, Error, CreateCartPayload>("api/v1/create-cart-item");
};

/* GET ALL CART ITEMS */

export const useGetCartItems = () => {
  return useGet<any, Error>("api/v1/show-all-cart-items", undefined, {
    refetchOnWindowFocus: false,
  });
};

/* DELETE CART ITEM */
export const useDeleteCartItem = () => {
  const deleteCartItem = async (cartItemId: number) => {
    const res = await api.delete(`api/v1/delete-cart-item/${cartItemId}`);
    return res.data;
  };

  return {
    deleteCartItem,
  };
};

export const useGetOrderDetailsId = (
  id: string | number | null | undefined
) => {
  // Only pass the URL if ID exists, otherwise pass empty string/null to skip fetch
  const url = id ? `api/v1/orders/${id}` : "";

  return useGet<OrderAPIResponse, Error>(url, undefined, {
    refetchOnWindowFocus: false,
  });
};

export const useGetOrders = () => {
  // Appends ?page=1, ?page=2 etc automatically if your useGet supports it,
  // otherwise we manually add it to the string.
  return useGet<OrderHistoryResponse, Error>(`api/v1/orders`, undefined, {
    refetchOnWindowFocus: false,
  });
};

export const useGetOrderDetails = (id: number | null) => {
  // Only fetch if ID is present (controlled by the UI state)
  return useGet<{ data: Order[] }, Error>(
    id ? `api/v1/orders/${id}` : "",
    undefined,
    {
      refetchOnWindowFocus: false,
      enabled: !!id, // Only run query if ID exists
    }
  );
};

export const useGetSubscriptionAlert = () => {
  // Assuming the endpoint follows your project pattern: "api/v1/subscription-alert"
  // If your base URL already includes 'api', remove it here.
  return useGet<SubscriptionAlertResponse, Error>(
    "api/v1/subscription-alert",
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
};
