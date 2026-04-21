import { createAsyncThunk } from "@reduxjs/toolkit";
import milestoneService, {
    type MilestoneRecord,
    type MilestoneCreateRequest,
    type MilestoneUpdateRequest,
} from "./milestoneService";

// ─── Payload Types ────────────────────────────────────────────────────────────

interface CreateMilestonePayload {
    projectId: string;
    data: MilestoneCreateRequest;
}

interface UpdateMilestonePayload {
    milestoneId: number;
    data: MilestoneUpdateRequest;
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const createMilestone = createAsyncThunk<MilestoneRecord, CreateMilestonePayload>(
    "milestones/create",
    async ({ projectId, data }, { rejectWithValue }) => {
        try {
            return await milestoneService.create(projectId, data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? "Failed to create milestone");
        }
    }
);

export const fetchMilestones = createAsyncThunk<MilestoneRecord[], string>(
    "milestones/fetchAll",
    async (projectId, { rejectWithValue }) => {
        try {
            return await milestoneService.getMilestones(projectId);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? "Failed to fetch milestones");
        }
    }
);

export const fetchMilestone = createAsyncThunk<MilestoneRecord, number>(
    "milestones/fetchOne",
    async (milestoneId, { rejectWithValue }) => {
        try {
            return await milestoneService.getMilestone(milestoneId);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? "Failed to fetch milestone");
        }
    }
);

export const updateMilestone = createAsyncThunk<MilestoneRecord, UpdateMilestonePayload>(
    "milestones/update",
    async ({ milestoneId, data }, { rejectWithValue }) => {
        try {
            return await milestoneService.update(milestoneId, data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? "Failed to update milestone");
        }
    }
);

export const deleteMilestone = createAsyncThunk<number, number>(
    "milestones/delete",
    async (milestoneId, { rejectWithValue }) => {
        try {
            await milestoneService.delete(milestoneId);
            return milestoneId; // return id so the slice can remove it from state
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message ?? "Failed to delete milestone");
        }
    }
);