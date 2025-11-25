import { refreshTokenService } from "@/services/auth.service";
import axios, { AxiosError } from "axios";
import { isTokenExpired } from "../lib/jwt_decode";
import { logout, updateAccessToken } from "../redux/features/auth/authSlice";
import { store } from "../redux/store/store";
import { router } from "expo-router";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  token?: string;
  params?: unknown;
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const apiClient = async ({
  method,
  endpoint,
  data,
  params,
  token,
}: ApiOptions): Promise<any> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const state = store.getState().auth;
  const accessToken = token || state.accessToken;
  const refreshToken = state.refreshToken;

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let url = `${BASE_URL}${endpoint}`;

  // Attach query params for GET
  if (params && method === "GET") {
    const queryString = new URLSearchParams(params as any).toString();
    url += `?${queryString}`;
  }

  console.log("API REQUEST:", { method, url, data, headers });

  try {
    const response = await axios({ method, url, data, params, headers });
    console.log("API RESPONSE:", response.data);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("API ERROR:", axiosError.response?.data || axiosError.message);

    // ✅ Always handle 401 (expired access token)
    if (axiosError.response?.status === 401) {
      try {
        console.log("Attempting to refresh token...");

        if (!refreshToken || isTokenExpired(refreshToken)) {
          console.warn("Refresh token expired or missing — logging out.");
          store.dispatch(logout());
          router.replace("/auth/login");
          return;
        }

        // 🧠 Make request to refresh token endpoint
        const response = await refreshTokenService(refreshToken);
        console.log("Token refreshed:", response.data);

        const newAccessToken = response.data.accessToken;

        // 🔄 Update Redux
        store.dispatch(updateAccessToken(newAccessToken));

        // 🔁 Retry the original request with the new token
        return apiClient({
          method,
          endpoint,
          data,
          params,
          token: newAccessToken,
        });
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        store.dispatch(logout());
        router.replace("/auth/login");
        throw refreshErr;
      }
    }

    throw error;
  }
};
