import { createSlice } from "@reduxjs/toolkit";
import type { InviteRecord, OrganizationOption } from "./inviteService";
import { fetchInvites, sendInvite, fetchOrganizations } from "./inviteThunk";

type InviteState = {
    invites: InviteRecord[];
    organizations: OrganizationOption[];
    loading: boolean;
    sending: boolean;
    error: string | null;
    successMessage: string | null;
};

const initialState: InviteState = {
    invites: [],
    organizations: [],
    loading: false,
    sending: false,
    error: null,
    successMessage: null,
};

const inviteSlice = createSlice({
    name: "invites",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvites.fulfilled, (state, action) => {
                state.loading = false;
                state.invites = action.payload;
            })
            .addCase(fetchInvites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                state.organizations = action.payload;
            })

            .addCase(sendInvite.pending, (state) => {
                state.sending = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(sendInvite.fulfilled, (state, action) => {
                state.sending = false;
                state.successMessage = `Invite sent to ${action.meta.arg.email}`;
            })
            .addCase(sendInvite.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = inviteSlice.actions;
export default inviteSlice.reducer;