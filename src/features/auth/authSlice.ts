import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { registerUser, userLogin, checkAuth } from "./authThunk";
import { type TokenValidationResponse } from "../../features/auth/authService";
import type { AuthResponse } from "../../features/auth/authService";

type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    username: string | null;
    authorities: string[];
};

export const initialState: AuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: !!localStorage.getItem("token"),
    username: null,
    authorities: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.username = null;
            state.authorities = [];
            localStorage.removeItem("token");   
        },
        setInitialized: (state) => {
            state.isLoading = false;
        },
        setLogin: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload.token);
        },
    },
    extraReducers: (builder) => {
        builder
            // --- REGISTRATION ---
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
            })

            // --- LOGIN ---
            .addCase(userLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.isAuthenticated = true;
                state.token = action.payload?.token ?? null;
                if (action.payload?.token) {
                    localStorage.setItem("token", action.payload.token);
                } else {
                    localStorage.removeItem("token");
                }
            })
            .addCase(userLogin.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                localStorage.removeItem("token");
            })

            // --- CHECK AUTH ---
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<TokenValidationResponse>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.username = action.payload.username ?? null;
                state.authorities = action.payload.authorities
                    ? action.payload.authorities.reduce<string[]>((acc, a) => {
                          if (a.authority) acc.push(a.authority);
                          return acc;
                      }, [])
                    : [];
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.username = null;
                state.authorities = [];
                localStorage.removeItem("token");
            });
    },
});

export const { logout, setInitialized, setLogin } = authSlice.actions;
export default authSlice.reducer;