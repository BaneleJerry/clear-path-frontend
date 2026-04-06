import apiClient from "../../lib/apiClient";

export type InviteStatus = "PENDING" | "USED" | "EXPIRED";

export type RoleName =
    | "ROLE_ADMIN"
    | "ROLE_STAFF"
    | "ROLE_MODERATOR"
    | "ROLE_USER";

export type InviteSummary = {
    token: string;
    code: string;
    inviteeEmail: string;
    assignedRole: RoleName;
    expiresAt: string;
    used: boolean;
    invitedByRole: RoleName;
    organisationId: string | null;
};

export type DashboardStats = {
    totalUsers: number;
    totalOrganisations: number;
    pendingInvites: number;
    activeToday: number;
};

const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const res = await apiClient.get("/admin/stats");
        return res.data;
    },

    getRecentInvites: async (): Promise<InviteSummary[]> => {
        const res = await apiClient.get("/invites?limit=5");
        return res.data;
    },
};

export default dashboardService;