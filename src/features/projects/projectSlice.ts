import { createSlice } from "@reduxjs/toolkit";
import type { ProjectRecord } from "./projectService";
import {
    fetchProjects,
    createProject,
    getProjectById,
    getProjectsByOrgId,
    updateProjectStatus,
    deleteProject
} from "./projectThunk";

type ProjectState = {
    projects: ProjectRecord[];
    selectedProject: ProjectRecord | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: ProjectState = {
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
    successMessage: null,
}

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearSelected: (state) => {
            state.selectedProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Fetch all ─────────────────────────────────────────────────────
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Create ─────────────────────────────────────────────────────
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
                state.successMessage = "Project created successfully";
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get by ID ──────────────────────────────────────────────────
            .addCase(getProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProject = action.payload;
            })
            .addCase(getProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get by Org ID ──────────────────────────────────────────────
            .addCase(getProjectsByOrgId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectsByOrgId.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(getProjectsByOrgId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Update Status ──────────────────────────────────────────────
            .addCase(updateProjectStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProjectStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const index = state.projects.findIndex(p => p.id === updated.id);

                if (index !== -1) {
                    state.projects[index] = updated;
                }

                if (state.selectedProject?.id === updated.id) {
                    state.selectedProject = updated;
                }
                state.successMessage = "Project status updated";
            })
            .addCase(updateProjectStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete ─────────────────────────────────────────────────────
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                state.projects = state.projects.filter(p => p.id !== deletedId);

                if (state.selectedProject?.id === deletedId) {
                    state.selectedProject = null;
                }
                state.successMessage = "Project deleted successfully";
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions for use in components
export const { clearMessages, clearSelected } = projectSlice.actions;

// Export the reducer for the store
export default projectSlice.reducer;