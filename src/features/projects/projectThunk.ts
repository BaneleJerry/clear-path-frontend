import { createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";
import { type ProjectCreateRequest, type ProjectRecord , type ProjectStatus} from "./projectService";

export const fetchProjects = createAsyncThunk<ProjectRecord[]>(
    "projects/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await projectService.getAll();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load projects"
            );
        }
    }); 


export const createProject = createAsyncThunk<ProjectRecord, ProjectCreateRequest>(
    "projects/create",
    async (project: ProjectCreateRequest, { rejectWithValue }) => {
        try {
            return await projectService.create(project);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to create project"
            );
        }
    }
)

export const getProjectById = createAsyncThunk<ProjectRecord,string>(
    "projects/getById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await projectService.getById(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load project details"
            );
        }
    }
);

export const getProjectsByOrgId = createAsyncThunk<ProjectRecord[],string>(
    "projects/getByOrgId",
    async (orgId: string, { rejectWithValue }) => {
        try {
            return await projectService.getByOrgId(orgId);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to load projects for organization"
            );
        }
    }
);

export const updateProjectStatus = createAsyncThunk<ProjectRecord, { id: string; status: ProjectStatus }>(
    "projects/updateStatus",
    async ({ id, status }: { id: string; status: ProjectStatus }, { rejectWithValue }) => {
        try {
            return await projectService.updateStatus(id, status);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to update project status"
            );
        }
    }
);

export const deleteProject = createAsyncThunk<void, string>(
    "projects/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            return await projectService.delete(id);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message ?? "Failed to delete project"
            );
        }
    }
);