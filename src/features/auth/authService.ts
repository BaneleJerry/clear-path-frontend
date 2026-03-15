import apiClient from "../../services/apiClient";
import type { components } from "../../types/api-schema";

// Extract types from the generated schema for easier use
export type LoginRequest = components["schemas"]["LoginRequest"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type IndividualRegistrationRequest = components["schemas"]["IndividualRegistrationRequest"];

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        // Note: Use the path exactly as defined in your generated 'paths'
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    },

    registerIndividual: async (data: IndividualRegistrationRequest): Promise<string> => {
        const response = await apiClient.post("/auth/register/individual", data);
        return response.data; // Backend returns string (OK) based on your schema
    }
};