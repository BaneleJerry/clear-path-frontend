import apiClient from "../../lib/apiClient";
import { type components } from "../../app/types/api-schema";

export type OrganizationRecord = components["schemas"]["OrganizationResponse"];
export type OrganizationCreateRequest = components["schemas"]["OrganizationRequest"];
export type OrganizationUpdateRequest = components["schemas"]["OrganizationRequest"];
export type OrganizationType = components["schemas"]["OrganizationRequest"]["type"];

const orgService = {

    getAll: async (): Promise<OrganizationRecord[]> => {
        const res = await apiClient.get("/organizations");
        return res.data;
    },

    getById: async (id: string): Promise<OrganizationRecord> => {
        const res = await apiClient.get(`/organizations/${id}`);
        return res.data;
    },

    create: async (data: OrganizationCreateRequest): Promise<OrganizationRecord> => {
        const res = await apiClient.post("/organizations", data);
        return res.data;
    },

    search: async (name: string, type: OrganizationType): Promise<OrganizationRecord[]> => {
        const res = await apiClient.get("/organizations/search", {
            params: { name, type },
        });
        return res.data;
    },

    update: async (id: string, data: OrganizationUpdateRequest): Promise<OrganizationRecord> => {
        const res = await apiClient.put(`/organizations/${id}`, data);
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/organizations/${id}`);
    },

    assignUser: async (orgId: string, userId: string): Promise<void> => {
        await apiClient.post("/organizations/assign-user", {
            organizationId: orgId,
            userId,
        });
    },

    removeUser: async (orgId: string, userId: string): Promise<void> => {
        await apiClient.delete(`/organizations/${orgId}/users/${userId}`);
    },

    getPendingInvites: async (orgId: string): Promise<number> => {
        const res = await apiClient.get(`/organizations/${orgId}/pending-invites`);
        return res.data;
    },
};

export default orgService;