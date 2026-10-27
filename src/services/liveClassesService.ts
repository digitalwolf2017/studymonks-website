import { useGet, usePost } from "@/utilities/api";
import {
  BatchAPIResponse,
  LiveClassesApiResponse,
  MeetingDetailsResponse,
} from "@/models/liveClasses";
import { keepPreviousData } from "@tanstack/react-query";

export const useLiveClasses = () => {
  return usePost<LiveClassesApiResponse, Error, { date: string }>(
    "/api/v1/dashboard",
    undefined,
    {
      // We will trigger this manually via useEffect when date changes
    }
  );
};

// 2. Meeting Details - GET
export const useGetMeetingDetails = (id: number | null) => {
  return useGet<MeetingDetailsResponse, Error>(
    `/api/v1/meeting-details/${id}`,
    undefined,
    {
      enabled: !!id, // Only fetch if ID is present
    }
  );
};

// ... other hooks ...

export const useGetBatchDetails = (
  batchId: string | number,
  page: number = 1
) => {
  const url = batchId ? `api/v1/batch-details/${batchId}?page=${page}` : "";

  return useGet<BatchAPIResponse, Error>(url, undefined, {
    enabled: !!batchId,
    // 👇 FIX: Use placeholderData instead of keepPreviousData: true
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
