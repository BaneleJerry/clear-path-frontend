import axios, { Axios} from "axios";
import { store } from "./store"; 


const BASE_URL = import.meta.env.BASE_URL ?? "http://localhost:8080/api";
const TIMEOUT_MS = Number(import.meta.env.TIMEOUT_MS) || 10000; // Default to 10 seconds if not set
const IS_PRODUCTION = import.meta.env.PROD ?? false;

if (IS_PRODUCTION) {
    throw new Error("API_BASE_URL is not set in production. Please set it in your environment variables.");
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