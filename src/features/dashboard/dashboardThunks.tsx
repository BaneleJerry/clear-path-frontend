import { createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService, {
    type DashboardStats,
    type InviteSummary,
} from "./dashboardService";

export const fetchDashboardStats = createAsyncThunk<DashboardStats>(
    "dashboard/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            return await dashboardService.getStats();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load stats"
            );
        }
    }
);

export const fetchRecentInvites = createAsyncThunk<InviteSummary[]>(
    "dashboard/fetchRecentInvites",
    async (_, { rejectWithValue }) => {
        try {
            return await dashboardService.getRecentInvites();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load invites"
            );
        }
    }
);