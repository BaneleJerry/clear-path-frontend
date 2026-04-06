import apiClient from "../../lib/apiClient";
import type { components } from "../../app/types/api-schema";


// Extract types from the generated schema for easier use
export type LoginRequest = components["schemas"]["LoginRequest"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type TokenValidationResponse = components["schemas"]["TokenValidateResponse"];

export type InviteResponse = components["schemas"]["InviteResponse"];
export type RedeemByCodeRequest = components["schemas"]["RedeemByCodeRequest"];

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    },

    registerUser: async (data: RegisterRequest): Promise<void> => {
        await apiClient.post("/auth/register", data);
    },

    validateToken: async (): Promise<TokenValidationResponse> => {
        const response = await apiClient.get<TokenValidationResponse>("/auth/validate");
        return response.data;
    },
};

export const inviteService = {
    redeemByToken: async (token: string): Promise<InviteResponse> => {
        const response = await apiClient.get(`/invites/validate?token=${token}`);
        return response.data;
    },

    redeemByCode: async (data: RedeemByCodeRequest): Promise<InviteResponse> => {
        const response = await apiClient.post("/invites/validate/code", data);
        return response.data;
    },
};