import { createAsyncThunk } from "@reduxjs/toolkit";
import { validateTokenWithBackend } from "../../services/authService";

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            return await validateTokenWithBackend();
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);