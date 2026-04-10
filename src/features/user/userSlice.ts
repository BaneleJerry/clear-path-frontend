import { createSlice } from "@reduxjs/toolkit";
import type { UserRecord } from "./userService";
import { fetchUsers, deleteUser, updateUserStatus } from "./userThunk";

type UserState = {
    users: UserRecord[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
};

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
    successMessage: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u.id !== action.meta.arg);
                state.successMessage = "User deleted successfully";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.users.findIndex((u) => u.id === updated.id);
                if (idx !== -1) state.users[idx] = updated;
                state.successMessage = `User ${updated.active ? "activated" : "deactivated"}`;
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = userSlice.actions;
export default userSlice.reducer;