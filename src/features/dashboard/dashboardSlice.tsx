import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats, fetchRecentInvites } from "./dashboardThunks";
import type { DashboardStats, InviteSummary } from "./dashboardService";

type DashboardState = {
    stats: DashboardStats | null;
    recentInvites: InviteSummary[];
    statsLoading: boolean;
    invitesLoading: boolean;
    error: string | null;
};

const initialState: DashboardState = {
    stats: null,
    recentInvites: [],
    statsLoading: false,
    invitesLoading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.statsLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchRecentInvites.pending, (state) => {
                state.invitesLoading = true;
            })
            .addCase(fetchRecentInvites.fulfilled, (state, action) => {
                state.invitesLoading = false;
                state.recentInvites = action.payload;
            })
            .addCase(fetchRecentInvites.rejected, (state, action) => {
                state.invitesLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;