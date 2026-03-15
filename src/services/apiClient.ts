import axios from "axios";
import { useAppStore } from "../store/authStore";

const apiClient = axios.create({
    // 1. Fixed typo: localhost
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
    // 2. Added a timeout (optional but recommended for fail-safes)
    timeout: 10000,
});

// Request Interceptor (Your existing logic)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor (The Fail-Safe)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        
        // Handle 401 Unauthorized (Expired Token)
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;