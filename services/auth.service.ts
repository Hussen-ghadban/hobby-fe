import { apiClient } from "@/api/base";
import type {
  RegisterFormData,
  RegisterResponse,
  LoginFormData,
  LoginResponse,
  RefreshTokenResponse,
} from "@/types/auth.types";
import { ENDPOINTS } from "@/api/endpoint";

// REGISTER
export const registerService = async (
  data: RegisterFormData
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Auth.register,
      data,
    });
    console.log("Register response:");

    return response as RegisterResponse;
  } catch (error) {
    throw error;
  }
};

// LOGIN
export const loginService = async (
  credentials: LoginFormData
): Promise<LoginResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Auth.login,
      data: credentials,
    });

    return response as LoginResponse;
  } catch (error) {
    throw error;
  }
};

// REFRESH TOKEN
export const refreshTokenService = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Auth.refreshToken,
      data: { refreshToken },
    });

    return response as RefreshTokenResponse;
  } catch (error) {
    throw error;
  }
};
