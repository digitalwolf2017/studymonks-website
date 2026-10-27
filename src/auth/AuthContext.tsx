/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthResponse, User } from "@/models/user";
import { log } from "@/utilities/debug";

// Define storage keys to avoid typos
const TOKEN_KEY = "study_monk_token";
const USER_KEY = "study_monk_user";

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  loading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Hydrate from LocalStorage on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        log("Invalid user JSON in localStorage", err);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    }
  }, []);

  // --- 2. Login Action ---
  const login = (response: AuthResponse) => {
    if (response.success && response.data && response.token) {
      const apiData = response.data as any;

      // Map API response to User Model
      // Note: Ensure your 'User' interface in @/models/user matches these fields
      const userData: User = {
        id: apiData.id,
        name: apiData.name, // Fixed: API returns 'name', not 'first_name'
        email: apiData.email,
        phone: apiData.phone,
        current_class_id: apiData.current_class_id,
        register_class_id: apiData.registered_class_id, // Note: API says 'registered_', model might say 'register_'
        board: apiData.board_id, // Mapping board_id to board
        type: apiData.type,

        // Default/Nullable fields based on your previous code
        no_of_screen: 1,
        account_type: apiData.type,
        otp: "",
        expiry_date: apiData.expiry_date ?? null,
        vendor_id: apiData.vendor_id ?? null,
      };

      // Update State
      setToken(response.token);
      setUser(userData);

      // Update LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    }
  };

  // --- 3. Logout Action ---
  const logout = () => {
    setToken(null);
    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken,
        setUser,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
