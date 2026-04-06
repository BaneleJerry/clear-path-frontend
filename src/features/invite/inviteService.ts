import apiClient from "../../lib/apiClient";

export type RoleName =
    | "ROLE_ADMIN"
    | "ROLE_STAFF"
    | "ROLE_MODERATOR"
    | "ROLE_USER";

export type InviteStatus = "pending" | "used" | "expired";

export type InviteRecord = {
    token: string;
    code: string;
    inviteeEmail: string;
    assignedRole: RoleName;
    expiresAt: string;
    used: boolean;
};

export type SendInvitePayload = {
    email: string;
    assignedRole: RoleName;
    organisationId?: string;
};

export type OrganizationOption = {
    id: string;
    name: string;
    type: "INDIVIDUAL" | "COMPANY";
};

const inviteService = {
    getAll: async (): Promise<InviteRecord[]> => {
        const res = await apiClient.get("/invites");
        return res.data;
    },

    send: async (payload: SendInvitePayload): Promise<void> => {
        await apiClient.post("/invites", payload);
    },

    getOrganizations: async (): Promise<OrganizationOption[]> => {
        const res = await apiClient.get("/organizations");
        return res.data;
    },
};

export default inviteService;