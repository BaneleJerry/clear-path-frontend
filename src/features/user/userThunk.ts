import { createAsyncThunk } from "@reduxjs/toolkit";
import userService, { type UserRecord } from "./userService";

export const fetchUsers = createAsyncThunk<UserRecord[]>(
    "users/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getAll();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load users"
            );
        }
    }
);

export const deleteUser = createAsyncThunk<void, string>(
    "users/delete",
    async (id, { rejectWithValue }) => {
        try {
            await userService.delete(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to delete user"
            );
        }
    }
);

export const updateUserStatus = createAsyncThunk<
UserRecord,
    { id: string; active: boolean }
    > (
        "users/updateStatus",
        async ({ id, active }, { rejectWithValue }) => {
            try {
                return await userService.updateStatus(id, active);
            } catch (err: any) {
                return rejectWithValue(
                    err.response?.data?.message ?? "Failed to update user status"
                );
            }
        }
    );