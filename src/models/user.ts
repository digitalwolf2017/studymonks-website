/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthResponse {
  success: boolean;
  data: AuthData;
  token: string;
  message?: string;
  error: string | null;
}

export interface AuthData {
  token: string;
  response_text: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  no_of_screen: number;
  expiry_date: string | null;
  account_type: number;
  type: number;
  otp: string;
  vendor_id: number | null;
  current_class_id: number | null;
  register_class_id: number | null;
  board: number;
}

export interface OTPResponse {
  success: boolean;
  data: OTPData;
  error: string | null;
}

export interface OTPData {
  response_text: string;
  result: string;
}
export interface authRequest {
  country_code?: string;
  phone?: string;
  email?: string;
}
export interface profileRequest {
  country_code?: string;
  name: string;
  phone: string;
  email: string;
}

export interface UserInfoResponse {
  success: boolean;
  data: UserInfo;
  error: string | null;
}

export interface UserInfo {
  id: number;
  apple_id: string;
  google_id: string | null;
  city_id: number | null;
  country_id: number;
  name: string;
  email: string;
  phone: string;
  no_of_screen: number;
  months: number;
  expiry_date: string | null;
  account_type: number;
  type: number;
  subscribe_premium: number;
  status: number;
  verified: number;
  otp: string | null;
  password: string | null;
  reseller_code: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp_number: string | null;
  profile_image: string;
  blood_group: string;
  roll_number: string | null;
  guardian_name: string | null;
  bs_id: string | null;
  section: string;
  dob: string | null;
  type: number;
  board: number;
  district: string | null;
  address: string | null;
  school_id: number;
  schoolName: string;
  city_id: number | null;
  cityName: string;
  is_verified: number;
  is_profile_completed: number;
  is_onboard_completed: number;
  registered_class_id: number;
  current_class_id: number;
  className: string;
  roman_letter: string;
  registeredRomanLetter: string;
  pincode: string;
  subjects: any;
  isSubscribed: boolean;
  vendor_id: number;
}

export interface ProfileResponse {
  status: boolean;
  success: boolean;
  data: UserProfile;
  token: string;
  error: string;
  message: string;
}

export interface SetClassPayload {
  class_id: string | number;
  subject_ids?: string[];
}
