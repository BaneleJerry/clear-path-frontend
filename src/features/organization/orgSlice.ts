import { createSlice } from "@reduxjs/toolkit";
import type { OrganizationRecord } from "./orgService";
import {
    fetchOrganizations,
    getOrganizationById,
    createOrganization,
    searchOrganizations,
    updateOrganization,
    deleteOrganization,
    assignUserToOrganization,
    removeUserFromOrganization,
    fetchPendingInvites,
} from "./orgThunk";

type OrgState = {
    organizations: OrganizationRecord[];
    selectedOrganization: OrganizationRecord | null;
    pendingInvitesCount: number | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
};

const initialState: OrgState = {
    organizations: [],
    selectedOrganization: null,
    pendingInvitesCount: null,
    loading: false,
    error: null,
    successMessage: null,
};

const orgSlice = createSlice({
    name: "organizations",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearSelected: (state) => {
            state.selectedOrganization = null;
            state.pendingInvitesCount = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // ── Fetch all ─────────────────────────────────────────────────────
            .addCase(fetchOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                state.loading = false;
                state.organizations = action.payload;
            })
            .addCase(fetchOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get by id ─────────────────────────────────────────────────────
            .addCase(getOrganizationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrganizationById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrganization = action.payload;
            })
            .addCase(getOrganizationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Create ────────────────────────────────────────────────────────
            .addCase(createOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.organizations.push(action.payload);
                state.successMessage = "Organisation created successfully";
            })
            .addCase(createOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Search ────────────────────────────────────────────────────────
            .addCase(searchOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchOrganizations.fulfilled, (state, action) => {
                state.loading = false;
                state.organizations = action.payload;
            })
            .addCase(searchOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Update ────────────────────────────────────────────────────────
            .addCase(updateOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrganization.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const idx = state.organizations.findIndex((o) => o.id === updated.id);
                if (idx !== -1) state.organizations[idx] = updated;
                state.successMessage = "Organisation updated successfully";
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete ────────────────────────────────────────────────────────
            .addCase(deleteOrganization.fulfilled, (state, action) => {
                state.organizations = state.organizations.filter(
                    (o) => o.id !== action.meta.arg
                );
                state.successMessage = "Organisation deleted successfully";
            })
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // ── Assign user ───────────────────────────────────────────────────
            .addCase(assignUserToOrganization.fulfilled, (state) => {
                state.successMessage = "User assigned to organisation";
            })
            .addCase(assignUserToOrganization.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // ── Remove user ───────────────────────────────────────────────────
            .addCase(removeUserFromOrganization.fulfilled, (state) => {
                state.successMessage = "User removed from organisation";
            })
            .addCase(removeUserFromOrganization.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // ── Pending invites ───────────────────────────────────────────────
            .addCase(fetchPendingInvites.fulfilled, (state, action) => {
                state.pendingInvitesCount = action.payload;
            })
            .addCase(fetchPendingInvites.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, clearSelected } = orgSlice.actions;
export default orgSlice.reducer;