/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePost, useGet } from "@/utilities/api";
import { AuthResponse } from "@/models/user";
import { useAuth } from "@/auth/AuthContext";

// --- Interfaces ---

export interface ClassRoom {
  id: number;
  title: string;
  instituteType: string;
}

export interface ClassRoomResponse {
  success: boolean;
  data: ClassRoom[];
  error?: string;
  message?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  class_room_id: number;
  phone?: string;
}

// --- Hook 1: Login ---
export const useLogin = () => {
  const { login: setAuthData } = useAuth();

  const login = usePost<
    AuthResponse,
    Error,
    { email_phone: string; password: string }
  >("/api/v1/login", undefined, {
    onSuccess: (data) => {
      if (data.success) {
        setAuthData(data);
        console.log("Student logged in successfully");
      }
    },
    onError: (err) => {
      console.error("Student login failed", err);
    },
  });

  return {
    login,
  };
};

// --- Hook 2: Registration ---
export const useStudentRegister = () => {
  const { login: setAuthData } = useAuth();

  const studentRegister = usePost<AuthResponse, Error, RegisterPayload>(
    "/api/v1/register",
    undefined,
    {
      onSuccess: (data) => {
        if (data.success) {
          // Auto-login the user after successful registration
          setAuthData(data);
          console.log("Registration successful, auto-logging in.");
        }
      },
      onError: (err) => {
        console.error("Registration failed", err);
      },
    }
  );

  return {
    studentRegister,
  };
};

// --- Hook 3: Get Classrooms ---
export const useGetClassRooms = () => {
  const getClassRooms = useGet<ClassRoomResponse, Error>(
    "/api/v1/select-class-rooms",
    undefined,
    {
      // Optional: Prevent refetching on window focus for dropdown data
      refetchOnWindowFocus: false,
    }
  );

  return {
    getClassRooms,
  };
};

export const useForgotPasswordOtp = () => {
  const sendOtp = usePost<
    { success: boolean; message: string },
    Error,
    { phone: string }
  >("/api/v1/forgot-password-otp");

  return {
    sendOtp,
  };
};
