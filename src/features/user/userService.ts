import apiClient from "../../lib/apiClient";

export type UserRole = {
    id: number;
    name: string;
};

export type UserRecord = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    active: boolean;
};

const userService = {
    getAll: async (): Promise<UserRecord[]> => {
        const res = await apiClient.get("/v1/admin/users");
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/v1/admin/users/${id}`);
    },

    updateStatus: async (id: string, active: boolean): Promise<UserRecord> => {
        const res = await apiClient.patch(`/v1/admin/users/${id}/status`, { active });
        return res.data;
    },
};

export default userService;