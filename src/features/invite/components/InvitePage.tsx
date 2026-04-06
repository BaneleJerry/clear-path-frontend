import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { fetchInvites, fetchOrganizations, sendInvite } from "../inviteThunk";
import { clearMessages } from "../inviteSlice";
import type { RoleName, InviteRecord } from "../inviteService";

// ─── Permission matrix ────────────────────────────────────────────────────────
const ALLOWED_ROLES: Record<string, RoleName[]> = {
    ROLE_ADMIN: ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_MODERATOR", "ROLE_USER"],
    ROLE_STAFF: ["ROLE_MODERATOR", "ROLE_USER"],
    ROLE_MODERATOR: ["ROLE_USER"],
};

const ROLE_LABEL: Record<RoleName, string> = {
    ROLE_ADMIN: "Admin", ROLE_STAFF: "Staff",
    ROLE_MODERATOR: "Moderator", ROLE_USER: "User",
};

const ROLE_BADGE: Record<RoleName, string> = {
    ROLE_ADMIN: "bg-purple-100 text-purple-800",
    ROLE_STAFF: "bg-teal-100 text-teal-800",
    ROLE_MODERATOR: "bg-amber-100 text-amber-800",
    ROLE_USER: "bg-blue-100 text-blue-800",
};

const STATUS_BADGE = {
    pending: "bg-yellow-100 text-yellow-800",
    used: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-500",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatus(invite: InviteRecord): "pending" | "used" | "expired" {
    if (invite.used) return "used";
    if (new Date(invite.expiresAt) < new Date()) return "expired";
    return "pending";
}

function timeLeft(expiresAt: string): string {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "—";
    const h = Math.floor(diff / 3_600_000);
    const d = Math.floor(h / 24);
    return d > 0 ? `${d}d ${h % 24}h` : `${h}h`;
}

// ─── Org-required roles ───────────────────────────────────────────────────────
const ORG_REQUIRED: RoleName[] = ["ROLE_MODERATOR", "ROLE_STAFF"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function InvitesPage() {
    const dispatch = useAppDispatch();
    const { invites, organizations, loading, sending, error, successMessage } =
        useAppSelector((s) => s.invites);
    const { authorities } = useAppSelector((s) => s.auth);

    const inviterRole = (authorities.find((a) =>
        Object.keys(ALLOWED_ROLES).includes(a)
    ) ?? "ROLE_USER") as RoleName;

    const allowedRoles = ALLOWED_ROLES[inviterRole] ?? [];
    const needsOrg = (role: RoleName) => ORG_REQUIRED.includes(role);

    // ── Form state ──
    const [email, setEmail] = useState("");
    const [assignedRole, setAssignedRole] = useState<RoleName>(allowedRoles[0]);
    const [organisationId, setOrgId] = useState("");
    const [filter, setFilter] = useState<"all" | "pending" | "used" | "expired">("all");

    useEffect(() => {
        dispatch(fetchInvites());
        dispatch(fetchOrganizations());
    }, [dispatch]);

    // Clear messages after 4s
    useEffect(() => {
        if (!successMessage && !error) return;
        const t = setTimeout(() => dispatch(clearMessages()), 4000);
        return () => clearTimeout(t);
    }, [successMessage, error, dispatch]);

    const handleSend = () => {
        if (!email) return;
        dispatch(sendInvite({
            email,
            assignedRole,
            ...(needsOrg(assignedRole) && organisationId ? { organisationId } : {}),
        }));
        setEmail("");
        setOrgId("");
    };

    const filtered = invites.filter((i) =>
        filter === "all" ? true : getStatus(i) === filter
    );

    // ── Permission note ──
    const permissionNote: Record<string, string> = {
        ROLE_ADMIN: "You can invite: Admin, Staff, Moderator, User",
        ROLE_STAFF: "You can invite: Moderator, User",
        ROLE_MODERATOR: "You can invite: User only",
    };

    const card = "bg-surface border border-border rounded-xl p-6";
    const inputCls = "flex-1 text-sm px-3 py-2 border border-border rounded-lg bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

    return (
        <div className="flex flex-col gap-6">

            {/* Page title */}
            <div>
                <h2 className="text-lg font-medium">Invites</h2>
                <p className="text-sm text-text-secondary mt-0.5">
                    Send and manage invitations
                </p>
            </div>

            {/* Feedback messages */}
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

            {/* Send invite form */}
            <div className={card}>
                <p className="text-sm font-medium mb-1">Send invite</p>
                <p className="text-xs text-text-secondary mb-4">
                    {permissionNote[inviterRole]}
                </p>

                <div className="flex flex-wrap gap-3 items-end">
                    {/* Email */}
                    <div className="flex flex-col gap-1 flex-1 min-w-48">
                        <label className="text-xs text-text-secondary">Email address</label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputCls}
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-text-secondary">Role</label>
                        <select
                            value={assignedRole}
                            onChange={(e) => {
                                setAssignedRole(e.target.value as RoleName);
                                setOrgId("");
                            }}
                            className={inputCls}
                        >
                            {allowedRoles.map((r) => (
                                <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Organisation — only shown when role requires it */}
                    {needsOrg(assignedRole) && (
                        <div className="flex flex-col gap-1 flex-1 min-w-48">
                            <label className="text-xs text-text-secondary">
                                Organisation <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={organisationId}
                                onChange={(e) => setOrgId(e.target.value)}
                                className={inputCls}
                            >
                                <option value="">Select organisation...</option>
                                {organizations.map((o) => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={
                            sending ||
                            !email ||
                            (needsOrg(assignedRole) && !organisationId)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-text-primary text-surface text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {sending
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Send className="w-4 h-4" />
                        }
                        {sending ? "Sending..." : "Send invite"}
                    </button>
                </div>

                {/* Email preview */}
                {email && (
                    <div className="mt-4 p-3 rounded-lg bg-bg border border-border text-xs text-text-secondary leading-relaxed">
                        <span className="font-medium text-text-primary">Email preview: </span>
                        {email} will receive an invite as{" "}
                        <span className="font-medium text-text-primary">
                            {ROLE_LABEL[assignedRole]}
                        </span>
                        {organisationId && organizations.length > 0 && (
                            <> in{" "}
                                <span className="font-medium text-text-primary">
                                    {organizations.find((o) => o.id === organisationId)?.name}
                                </span>
                            </>
                        )}
                        . They'll receive a link and an 8-character code.
                    </div>
                )}
            </div>

            {/* Invites table */}
            <div className={card}>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium">Sent invites</p>
                    <div className="flex gap-1">
                        {(["all", "pending", "used", "expired"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-xs px-3 py-1 rounded-full border transition-colors ${filter === f
                                        ? "bg-text-primary text-surface border-text-primary"
                                        : "border-border text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-sm text-text-secondary">
                        Loading invites...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-8 text-center text-sm text-text-secondary">
                        {filter === "all" ? "No invites sent yet." : `No ${filter} invites.`}
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                {["Email", "Role", "Code", "Expires", "Status"].map((h) => (
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
                            {filtered.map((invite) => {
                                const status = getStatus(invite);
                                return (
                                    <tr
                                        key={invite.token}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="py-3 text-text-primary">
                                            {invite.inviteeEmail}
                                        </td>
                                        <td className="py-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_BADGE[invite.assignedRole]}`}>
                                                {ROLE_LABEL[invite.assignedRole]}
                                            </span>
                                        </td>
                                        <td className="py-3 font-mono text-xs text-text-secondary">
                                            {invite.code}
                                        </td>
                                        <td className="py-3 text-text-secondary text-xs">
                                            {status === "pending"
                                                ? timeLeft(invite.expiresAt)
                                                : "—"}
                                        </td>
                                        <td className="py-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[status]}`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}