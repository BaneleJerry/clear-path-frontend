import apiClient from "./apiClient";

type ValidateResponse = {
  isValid: boolean;
  user: string | null;
  roles: string[];
};

export const validateTokenWithBackend = async (): Promise<ValidateResponse> => {
  try {
    const response = await apiClient.get("/auth/validate");

    return {
      isValid: true,
      user: response.data?.username ?? null,
      roles: response.data?.authorities ?? [],
    };

  } catch (error) {
    console.warn("Session expired or invalid token");

    return {
      isValid: false,
      user: null,
      roles: [],
    };
  }
};
