import axios from "axios";
import { useAppStore } from "../store/authStore";

export const checkBackendHealth = async () => {
    try {
        const res = await axios.get("http://localhost:8080/actuator/health");

        if (res.data.status === "UP") {
            useAppStore.getState().setBackendDown(false);
        }
    } catch (error) {
        console.error("Backend health check failed");
        useAppStore.getState().setBackendDown(true);
    }
};