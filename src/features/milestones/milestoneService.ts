import apiClient from "../../lib/apiClient";
import { type components } from "../../app/types/api-schema";

export type MilestoneRecord = components["schemas"]["MilestoneResponse"];
export type MilestoneCreateRequest = components["schemas"]["MilestoneCreateRequestDTO"];
export type MilestoneUpdateRequest = components["schemas"]["MilestoneUpdateRequest"];


const milestoneService = {
    create: async (projectId: string, data: MilestoneCreateRequest): Promise<MilestoneRecord> => {
        const res = await apiClient.post(`v1/projects/${projectId}/milestones`, data);
        return res.data;
    },

    getMilestones: async (projectId: string): Promise<MilestoneRecord[]> => {
        const res = await apiClient.get(`v1/projects/${projectId}/milestones`);
        return res.data;
    },

    getMilestone: async (milestoneId: string): Promise<MilestoneRecord> => {
        const res = await apiClient.get(`v1/milestones/${milestoneId}`);
        return res.data;
    },

    update: async (milestoneId: string, data: MilestoneUpdateRequest): Promise<MilestoneRecord> => {
        const res = await apiClient.put(`v1/milestones/${milestoneId}`, data);
        return res.data;
    },

    delete: async (milestoneId: string): Promise<void> => {
        await apiClient.delete(`v1/milestones/${milestoneId}`);
    }
}

export default milestoneService;