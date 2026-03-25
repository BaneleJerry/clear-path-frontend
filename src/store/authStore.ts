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
  
  setAuth: (token: string, user: User, roles: string[]) => void;
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

  setAuth: (token, user, roles) => {
    localStorage.setItem("auth_token", token);
    set({ token, isAuthenticated: true, user, roles, isInitialLoading: false });
  },

  validateToken: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      set({ isAuthenticated: false, isInitialLoading: true });
      return;
    }

    // Using your existing service logic
    const result = await validateTokenWithBackend();
    
    if (result.isValid) {
      set({ 
        isAuthenticated: true, 
        user: result.user as any, // Cast as needed based on your API return
        roles: result.roles, 
        isInitialLoading: false 
      });
    } else {
      localStorage.removeItem("auth_token");
      set({ token: null, isAuthenticated: false, isInitialLoading: false, user: null, roles: [] });
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    set({ token: null, isAuthenticated: false, user: null, roles: [] });
  },
}));