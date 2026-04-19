import apiClient from "../../lib/apiClient";
import { type components } from "../../app/types/api-schema";

// export type ProjectRecord = components["schemas"]["ProjectRequest"]; // Not avaible in the background, need to check with backend 
export type ProjectCreateRequest = components["schemas"]["ProjectRequestDTO"];
export type ProjectRecord = components["schemas"]["ProjectResponseDTO"];
export type ProjectStatus = NonNullable<ProjectRecord["status"]>;

const projectService = {
    getAll: async (): Promise<ProjectRecord[]> => {
        const res = await apiClient.get("/v1/projects");
        return res.data;
    },

    create: async (project: ProjectCreateRequest): Promise<ProjectRecord> => {
        const res = await apiClient.post("/v1/projects", project);
        return res.data;
    },

    getById: async (id: string): Promise<ProjectRecord> => {
        const res = await apiClient.get(`/v1/projects/${id}`);
        return res.data;
    },

    getByOrgId: async (orgId: string): Promise<ProjectRecord[]> => {
        const res = await apiClient.get(`/v1/projects/organization/${orgId}/`);
        return res.data;
    },

    updateStatus: async (id: string, status: ProjectStatus): Promise<ProjectRecord> => {
        const res = await apiClient.patch(`/v1/projects/${id}/status`, null, {
            params: { status }
        });
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/v1/projects/${id}`);
    }
};

export default projectService;