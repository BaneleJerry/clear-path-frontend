import axios from "axios";
import { useAuthStore } from "../store/store";

export const checkBackendHealth = async () => {
    try {
        const res = await axios.get("http://localhost:8080/actuator/health");

        // If the request succeeds and status is UP, backend is NOT down
        const isUp = res.data?.status === "UP";
        useAuthStore.getState().setBackendDown(!isUp);

    } catch (error) {
        console.error("Backend health check failed");
        // If the request fails (404, 500, or Network Error), backend IS down
        useAuthStore.getState().setBackendDown(true);
    }
};