import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { checkAuth } from "./authThunk";
import type { components } from "../../types/api-schema";

type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    username: string | null;
    authorities: string[];
};

type ValidateResponse = components["schemas"]["TokenValidateResponse"]
type AuthResponse = components["schemas"]["ApiResponseAuthResponse"];

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: true, 
    username: null,
    authorities: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        setLogin: (state, action: PayloadAction<AuthResponse>) => {
            const token = action.payload.data?.token;
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
                state.isLoading = false;
                localStorage.setItem("token", token);
            }
        }
        ,
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.username = null;
            state.authorities = [];
            localStorage.removeItem("token");
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<ValidateResponse>) => {
                state.isLoading = false;
                state.isAuthenticated = !!action.payload.authenticated;
                state.username = action.payload.username ?? null;
                state.authorities = action.payload.authorities
                    ?.map(a => a.authority)
                    .filter((a): a is string => !!a) ?? [];
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null; // Clear token if invalid
                localStorage.removeItem("token");
            });
    },
});

export const { setToken, logout, setLoading, setLogin } = authSlice.actions;
export default authSlice.reducer;