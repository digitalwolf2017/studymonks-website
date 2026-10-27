// hooks/useApi.ts
import {
  useQuery,
  useMutation,
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { API_BASE_URL, CDN_BASE_URL } from "@/models/base";

const queryClient = new QueryClient();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Replace with your API base URL
});

const axiosCDNInstance = axios.create({
  baseURL: CDN_BASE_URL, // Replace with your API base URL
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("study_monk_token");
    if (token) {
      config.headers = new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${token}`,
      });
    }
  }
  return config;
});

export const fetchData = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.get<T>(url, config);
  return response.data;
};

export const fetchCDN = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosCDNInstance.get<T>(url, config);
  return response.data;
};

export const useGet = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, [string, AxiosRequestConfig?]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<TQueryFnData, TError, TData, [string, AxiosRequestConfig?]>({
    queryKey: [url, config],
    queryFn: async () => {
      const response = await api.get<TQueryFnData>(url, config);
      return response.data;
    },
    ...options,
  });
};

export const useGetCDN = <TQueryFnData, TError, TData = TQueryFnData>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<TQueryFnData, TError, TData>
) => {
  return useQuery<TQueryFnData, TError, TData>({
    queryKey: [url, config],
    queryFn: async () => {
      const response = await axiosCDNInstance.get<TQueryFnData>(url, config);
      return response.data;
    },
    ...options,
  });
};

export const usePost = <TData, TError, TVariables>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, TError, TVariables>
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axiosInstance.post<TData>(url, variables, config);
      return response.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(); // Invalidate queries to ensure fresh data
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

export const useDelete = <TData, TError = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, TError, void>
) => {
  return useMutation<TData, TError, void>({
    mutationFn: async () => {
      const response = await axiosInstance.delete<TData>(url, config);
      return response.data;
    },
    ...options,
  });
};

// method for the put which is should be replace in future with the POST method okay..

export const usePut = <TData, TError, TVariables>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, TError, TVariables>
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axiosInstance.put<TData>(url, variables, config);
      return response.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(); // keep data fresh
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

// 👇 Add this export
export const api = axiosInstance;
