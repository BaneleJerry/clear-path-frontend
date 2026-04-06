import { createAsyncThunk } from "@reduxjs/toolkit";
import inviteService, {
    type InviteRecord,
    type OrganizationOption,
    type SendInvitePayload,
} from "./inviteService";

export const fetchInvites = createAsyncThunk<InviteRecord[]>(
    "invites/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await inviteService.getAll();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load invites"
            );
        }
    }
);

export const fetchOrganizations = createAsyncThunk<OrganizationOption[]>(
    "invites/fetchOrganizations",
    async (_, { rejectWithValue }) => {
        try {
            return await inviteService.getOrganizations();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load organisations"
            );
        }
    }
);

export const sendInvite = createAsyncThunk<void, SendInvitePayload>(
    "invites/send",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await inviteService.send(payload);
            dispatch(fetchInvites()); // refresh table after sending
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to send invite"
            );
        }
    }
);