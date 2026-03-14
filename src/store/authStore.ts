import { create } from 'zustand';
import type { AuthResponse } from '../features/auth/authService';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (data: AuthResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),

    setAuth: (data) => {
        if (data.token) {
            localStorage.setItem("auth_token", data.token);
            set({ token: data.token, isAuthenticated: true });
        }
    },

    logout: () => {
        localStorage.removeItem("auth_token");
        set({ token: null, isAuthenticated: false });
    },
}));

interface AppState {
    isBackendDown: boolean;
    setBackendDown: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBackendDown: false,
    setBackendDown: (status) => set({ isBackendDown: status }),
}));