/* -------------------- Subscription Plan Models -------------------- */

/* -------------------- Nested Models -------------------- */

export interface Batch {
  id: number;
  class_room_id: number;
  subject_id: number;
  title: string;
  description: string | null;
  image_url: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  access_username: string | null;
  access_password: string | null;
  active: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ClassRoom {
  id: number;
  board_id: number;
  title: string;
  image_url: string;
  total_subjects: number;
  total_chapters: number;
  total_tutorials: number;
  total_notes: number;
  total_duration: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  class_room_id: number;
  title: string;
  image_url: string;
  total_chapters: number;
  total_tutorials: number;
  total_notes: number;
  total_duration: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  class_room_id: number;
  status: number; // 0: Pending, 1: OnHold, 2: Paid, 3: Failed, 4: Cancel, 5: Partial Refund, 6: Full Refund
  payment_method: number;
  order_number: string;
  order_id: string;
  payment_id?: string | null; // Optional
  total_price: number;
  discounted_total_price: number;
  created_at: string;
  updated_at: string;
  uuid?: string; // New
  refund_id?: string | null; // New
  total_refund_price?: number | null; // New
  deleted_at?: string | null;
}

export interface OrderHistoryResponse {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface SubscriptionPlan {
  id: number;
  price: number;
  discounted_price: number;
  duration: number;
  // Nested relations from your JSON
  subject?: { title: string; image_url?: string };
  class?: { title: string };
  batch?: {
    title: string;
    image_url?: string;
    start_date?: string;
    end_date?: string;
  };
}

export interface OrderItem {
  id: number;
  order_id: number;
  subscription_plan_id: number;
  quantity: number;
  price_at_order: number;
  total_price: number;
  discounted_price: number; // Item specific discount
  total_discounted_price: number;
  refund_id?: string | null;
  refund_price?: number | null;
  // The plan details
  subscription_plan?: SubscriptionPlan;
}

export interface Order {
  id: number;
  uuid?: string;
  user_id: number;
  class_room_id: number;
  status: number; // 0-6
  payment_method: number;
  order_number: string;
  order_id: string;
  payment_id?: string | null;
  refund_id?: string | null;
  total_refund_price?: number | null;
  total_price: number;
  discounted_total_price: number;
  created_at: string;
  updated_at: string;
  // Detail endpoint includes these:
  order_items?: OrderItem[];
  user?: any; // Add specific user type if needed
  class?: { title: string };
}
