import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { registerUser, userLogin, checkAuth } from "./authThunk"; // Import your new login thunk
import { type TokenValidationResponse } from "../../features/auth/authService"; // Import the expected response type from your auth service

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
            // If a token exists, we treat them as authenticated for now
            state.isAuthenticated = !!state.token;
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
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(userLogin.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.username = action.payload.username;
                state.authorities = action.payload.authorities || [];
            })
            .addCase(userLogin.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
            });

        // --- CHECK AUTH ---
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<TokenValidationResponse>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.username = action.payload.username ?? null;
                state.authorities = action.payload.authorities
                    ? action.payload.authorities
                        .map(a => a.authority)           
                        .filter((a): a is string => !!a) 
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


    }
});

export const { logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;