import axios from "axios";
import { store } from "./store"; 


const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10000;
const IS_PRODUCTION = import.meta.env.PROD;

if (IS_PRODUCTION && !BASE_URL.startsWith("https://")) {
    throw new Error(`VITE_API_BASE_URL must use HTTPS in production, got: ${BASE_URL}`);
}

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: TIMEOUT_MS,
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
    const token = store.getState().auth.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);


export default apiClient;