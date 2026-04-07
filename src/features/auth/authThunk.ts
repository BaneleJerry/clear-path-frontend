import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService, type RegisterRequest } from "../../features/auth/authService";


export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            await authService.registerUser(userData);
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed.";
            return rejectWithValue(message);
        }
    }
);
export const userLogin = createAsyncThunk(
    "auth/userLogin",
    async (credentials: { email: string; password: string }, {  rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            const data = response;

            const token = data?.token;
            if (token) {
                localStorage.setItem("token", token); 
            }


            return data; 
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Login failed. Please check your credentials.";
            return rejectWithValue(message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            // The apiClient interceptor will automatically attach the token
            const data = await authService.validateToken();
            return data;
        } catch (error: any) {
            // If validation fails, clear the invalid token
            localStorage.removeItem("token");
            return rejectWithValue(error.response?.data?.message || "Session expired");
        }
    }
);