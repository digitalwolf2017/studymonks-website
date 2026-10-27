import { MetaData } from "./interfaces";

export const CDN_BASE_URL = "";
export const API_BASE_URL = "https://app.studymonks.com/";
export const ADMIN_PATH = "https://app.studymonks.com/api/admin";

export const FRONTEND_PATH = "http://localhost:3000/";

export const DEFAULT_META: MetaData = {
  title: "Study Monk - Online learning platform",
  description: "Study Monk - Online learning platform",
  url: `https://studymonks.com/`,
  ogImage: `/images/og.pmg`,
  keywords: "Online class, online tutorials, ",
};

export const BUCKET = "studymonk2025";
export const REGION = "ap-south-1";
export const IDENTITY_POOL_ID =
  "ap-south-1:ff784eef-cf77-4cab-b358-66febac9f0e9";

export interface GenericResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
export interface GenericError {
  success: boolean;
  message: string;
}
