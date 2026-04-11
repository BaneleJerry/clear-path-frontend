import { useEffect, useState } from "react";
import {
    AlertCircle, CheckCircle, Search,
    Trash2, ToggleLeft, ToggleRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { fetchUsers, deleteUser, updateUserStatus } from "../userThunk";
import { clearMessages } from "../userSlice";
import type { UserRecord } from "../userService";

const ROLE_BADGE: Record<string, string> = {
    ROLE_ADMIN: "bg-purple-100 text-purple-800",
    ROLE_STAFF: "bg-teal-100 text-teal-800",
    ROLE_MODERATOR: "bg-amber-100 text-amber-800",
    ROLE_USER: "bg-blue-100 text-blue-800",
};

const ROLE_LABEL: Record<string, string> = {
    ROLE_ADMIN: "Admin", ROLE_STAFF: "Staff",
    ROLE_MODERATOR: "Moderator", ROLE_USER: "User",
};

function getInitials(first: string, last: string) {
    return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function ConfirmDialog({
    user,
    onConfirm,
    onCancel,
}: {
    user: UserRecord;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Delete user</p>
                        <p className="text-xs text-text-secondary">This action cannot be undone</p>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-text-primary">
                        {user.firstName} {user.lastName}
                    </span>?
                </p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UsersPage() {
    const dispatch = useAppDispatch();
    const { users, loading, error, successMessage } =
        useAppSelector((s) => s.users);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pendingDelete, setPendingDelete] = useState<UserRecord | null>(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Auto-clear messages
    useEffect(() => {
        if (!successMessage && !error) return;
        const t = setTimeout(() => dispatch(clearMessages()), 4000);
        return () => clearTimeout(t);
    }, [successMessage, error, dispatch]);

    const handleDelete = (user: UserRecord) => setPendingDelete(user);

    const confirmDelete = () => {
        if (!pendingDelete) return;
        dispatch(deleteUser(pendingDelete.id));
        setPendingDelete(null);
    };

    const handleToggleStatus = (user: UserRecord) => {
        dispatch(updateUserStatus({ id: user.id, active: !user.active }));
    };

    const filtered = users.filter((u) => {
        const matchSearch =
            search === "" ||
            `${u.firstName} ${u.lastName} ${u.email}`
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchRole =
            roleFilter === "all" || u.role.name === roleFilter;

        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "active" ? u.active : !u.active);

        return matchSearch && matchRole && matchStatus;
    });

    const card = "bg-surface border border-border rounded-xl p-6";
    const inputCls = "text-sm px-3 py-2 border border-border rounded-lg bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

    return (
        <div className="flex flex-col gap-6">

            {/* Delete confirm dialog */}
            {pendingDelete && (
                <ConfirmDialog
                    user={pendingDelete}
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}

            {/* Page title */}
            <div>
                <h2 className="text-lg font-medium">Users</h2>
                <p className="text-sm text-text-secondary mt-0.5">
                    Manage all registered users
                </p>
            </div>

            {/* Feedback */}
            {successMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className={card}>
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputCls} pl-9 w-full`}
                        />
                    </div>

                    {/* Role filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className={inputCls}
                    >
                        <option value="all">All roles</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_STAFF">Staff</option>
                        <option value="ROLE_MODERATOR">Moderator</option>
                        <option value="ROLE_USER">User</option>
                    </select>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={inputCls}
                    >
                        <option value="all">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* Count */}
                    <span className="text-xs text-text-secondary ml-auto">
                        {filtered.length} of {users.length} users
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className={card}>
                {loading ? (
                    <div className="py-12 text-center text-sm text-text-secondary">
                        Loading users...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-12 text-center text-sm text-text-secondary">
                        No users found.
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                {["User", "Email", "Role", "Status", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider pb-3 border-b border-border"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-border last:border-0 hover:bg-bg transition-colors"
                                >
                                    {/* User */}
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-medium text-primary">
                                                    {getInitials(user.firstName, user.lastName)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-text-primary">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="py-3 pr-4 text-text-secondary">
                                        {user.email}
                                    </td>

                                    {/* Role */}
                                    <td className="py-3 pr-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_BADGE[user.role.name] ?? "bg-gray-100 text-gray-600"}`}>
                                            {ROLE_LABEL[user.role.name] ?? user.role.name}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 pr-4">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            {/* Toggle status */}
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                title={user.active ? "Deactivate" : "Activate"}
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg transition-colors"
                                            >
                                                {user.active
                                                    ? <ToggleRight className="w-5 h-5 text-green-600" />
                                                    : <ToggleLeft className="w-5 h-5" />
                                                }
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(user)}
                                                title="Delete user"
                                                className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}