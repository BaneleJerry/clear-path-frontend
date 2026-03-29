import apiClient from "./apiClient";
import type { components } from "../types/api-schema";

// Types from your schema
type ValidateResponse = components["schemas"]["TokenValidateResponse"];
type LoginRequest = components["schemas"]["LoginRequest"];
type LoginResponse = components["schemas"]["ApiResponseAuthResponse"];

/**
 * Validates the current session token with the backend.
 */
export const validateTokenWithBackend = async (): Promise<ValidateResponse> => {
  try {
    const { data } = await apiClient.get<ValidateResponse>("/auth/validate");
    return data;
  } catch (error) {
    console.warn("Session expired or invalid token", error);
    return {
      authenticated: false,
      authorities: [],
      username: undefined,
    };
  }
};


export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // The backend returns the ApiResponseAuthResponse wrapper
  const { data } = await apiClient.post<LoginResponse>("/auth/login", credentials);
  console.log(data);
  
  return data;
};

// Exporting as an object to support the 'authService.login' syntax
export const authService = {
  login,
  validateTokenWithBackend,
};