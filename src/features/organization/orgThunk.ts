import { createAsyncThunk } from "@reduxjs/toolkit";
import orgService, { type OrganizationCreateRequest, type OrganizationRecord, type OrganizationType } from "./orgService";

export const fetchOrganizations = createAsyncThunk<OrganizationRecord[], void>(
    "organizations/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await orgService.getAll();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load organizations"
            );
        }
    }
);

export const getOrganizationById = createAsyncThunk<OrganizationRecord, string>(
    "organizations/getById",
    async (id, { rejectWithValue }) => {
        try {
            return await orgService.getById(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load organization details"
            );
        }
    }
);

export const createOrganization = createAsyncThunk<OrganizationRecord, OrganizationCreateRequest>(
    "organizations/create",
    async (data, { rejectWithValue }) => {
        try {
            return await orgService.create(data);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to create organization"
            );
        }
    }
);

export const searchOrganizations = createAsyncThunk<OrganizationRecord[], { name: string; type: OrganizationType }>(
    "organizations/search",
    async ({ name, type }, { rejectWithValue }) => {
        try {
            return await orgService.search(name, type);
        }
        catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to search organizations"
            );
        }
    }
);

export const updateOrganization = createAsyncThunk<OrganizationRecord, { id: string; data: OrganizationCreateRequest }>(
    "organizations/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await orgService.update(id, data);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to update organization"
            );
        }
    }
);

export const deleteOrganization = createAsyncThunk<void, string>(
    "organizations/delete",
    async (id, { rejectWithValue }) => {
        try {
            await orgService.delete(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to delete organization"
            );
        }
    }
);

export const assignUserToOrganization = createAsyncThunk<void, { orgId: string; userId: string }>(
    "organizations/assignUser",
    async ({ orgId, userId }, { rejectWithValue }) => {
        try {
            await orgService.assignUser(orgId, userId);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to assign user to organization"
            );
        }
    }
);

export const removeUserFromOrganization = createAsyncThunk<void, { orgId: string; userId: string }>(
    "organizations/removeUser",
    async ({ orgId, userId }, { rejectWithValue }) => {
        try {
            await orgService.removeUser(orgId, userId);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to remove user from organization"
            );
        }
    }
);

export const fetchPendingInvites = createAsyncThunk<number, string>(
    "organizations/fetchPendingInvites",
    async (orgId, { rejectWithValue }) => {
        try {
            return await orgService.getPendingInvites(orgId);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to fetch pending invites"
            );
        }
    }
);
