import { create } from 'zustand';
import { validateTokenWithBackend } from '../services/authService'; // Adjust path as needed

interface User {
  id: string;
  email: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  isBackendDown: boolean; // Added this
  user: User | null;
  roles: string[];

  setAuth: (token: string) => void;
  setBackendDown: (isDown: boolean) => void; // Added this
  validateToken: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  isAuthenticated: !!localStorage.getItem("auth_token"),
  isInitialLoading: true,
  isBackendDown: false, // Default to false
  user: null,
  roles: [],

  setBackendDown: (isDown) => set({ isBackendDown: isDown }),

  setAuth: (token) => {
    localStorage.setItem("auth_token", token);
    set({ token, isAuthenticated: true, isInitialLoading: false });
  },

  validateToken: async () => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      set({
        token: null,
        isAuthenticated: false,
        isInitialLoading: false
      });
      return;
    }

    const result = await validateTokenWithBackend();

    if (result.isValid) {
      set({
        token,
        isAuthenticated: true,
        user: result.user as any,
        roles: result.roles,
        isInitialLoading: false
      });
      console.log(useAuthStore);
      
    } else {
      localStorage.removeItem("auth_token");
      set({
        token: null,
        isAuthenticated: false,
        isInitialLoading: false,
        user: null,
        roles: []
      });
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    set({ token: null, isAuthenticated: false, user: null, roles: [] });
  },
}));