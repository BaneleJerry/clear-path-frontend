import { createSlice } from "@reduxjs/toolkit";
import type { MilestoneRecord } from "./milestoneService";
import {
    createMilestone,
    deleteMilestone,
    fetchMilestone,
    fetchMilestones,
    updateMilestone,
} from "./milestoneThunk";

type LoadingOperation = "create" | "fetchAll" | "fetchOne" | "update" | "delete" | null;

type MilestoneState = {
    milestones: MilestoneRecord[];
    selectedMilestone: MilestoneRecord | null;
    loadingOperation: LoadingOperation;
    error: string | null;
    successMessage: string | null;
};

const initialState: MilestoneState = {
    milestones: [],
    selectedMilestone: null,
    loadingOperation: null,
    error: null,
    successMessage: null,
};

const milestoneSlice = createSlice({
    name: "milestones",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearSelected: (state) => {
            state.selectedMilestone = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ── Create ──────────────────────────────────────────────────────────
            .addCase(createMilestone.pending, (state) => {
                state.loadingOperation = "create";
                state.error = null;
            })
            .addCase(createMilestone.fulfilled, (state, action) => {
                state.loadingOperation = null;
                state.milestones.push(action.payload);
                state.successMessage = "Milestone created successfully";
            })
            .addCase(createMilestone.rejected, (state, action) => {
                state.loadingOperation = null;
                state.error = action.payload as string;
            })

            // ── Fetch All ───────────────────────────────────────────────────────
            .addCase(fetchMilestones.pending, (state) => {
                state.loadingOperation = "fetchAll";
                state.error = null;
            })
            .addCase(fetchMilestones.fulfilled, (state, action) => {
                state.loadingOperation = null;
                state.milestones = action.payload;
            })
            .addCase(fetchMilestones.rejected, (state, action) => {
                state.loadingOperation = null;
                state.error = action.payload as string;
            })

            // ── Fetch One ───────────────────────────────────────────────────────
            .addCase(fetchMilestone.pending, (state) => {
                state.loadingOperation = "fetchOne";
                state.error = null;
            })
            .addCase(fetchMilestone.fulfilled, (state, action) => {
                state.loadingOperation = null;
                state.selectedMilestone = action.payload;
            })
            .addCase(fetchMilestone.rejected, (state, action) => {
                state.loadingOperation = null;
                state.error = action.payload as string;
            })

            // ── Update ──────────────────────────────────────────────────────────
            .addCase(updateMilestone.pending, (state) => {
                state.loadingOperation = "update";
                state.error = null;
            })
            .addCase(updateMilestone.fulfilled, (state, action) => {
                state.loadingOperation = null;
                const index = state.milestones.findIndex(
                    (m) => m.id === action.payload.id
                );
                if (index !== -1) state.milestones[index] = action.payload;
                if (state.selectedMilestone?.id === action.payload.id) {
                    state.selectedMilestone = action.payload;
                }
                state.successMessage = "Milestone updated successfully";
            })
            .addCase(updateMilestone.rejected, (state, action) => {
                state.loadingOperation = null;
                state.error = action.payload as string;
            })

            // ── Delete ──────────────────────────────────────────────────────────
            .addCase(deleteMilestone.pending, (state) => {
                state.loadingOperation = "delete";
                state.error = null;
            })
            .addCase(deleteMilestone.fulfilled, (state, action) => {
                state.loadingOperation = null;
                state.milestones = state.milestones.filter(
                    (m) => m.id !== action.payload
                );
                if (state.selectedMilestone?.id === action.payload) {
                    state.selectedMilestone = null;
                }
                state.successMessage = "Milestone deleted successfully";
            })
            .addCase(deleteMilestone.rejected, (state, action) => {
                state.loadingOperation = null;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, clearSelected } = milestoneSlice.actions;
export default milestoneSlice.reducer;