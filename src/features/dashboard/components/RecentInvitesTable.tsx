import type { InviteSummary } from "../dashboardService";

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

const STATUS_BADGE = {
    pending: "bg-yellow-100 text-yellow-800",
    used: "bg-green-100 text-green-800",
    expired: "bg-border/40 text-text-secondary",
};

function getStatus(invite: InviteSummary): "pending" | "used" | "expired" {
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

type Props = { invites: InviteSummary[]; loading: boolean };

export default function RecentInvitesTable({ invites, loading }: Props) {
    if (loading) {
        return (
            <div className="py-6 text-center text-sm text-text-secondary">
                Loading invites...
            </div>
        );
    }

    if (invites.length === 0) {
        return (
            <div className="py-6 text-center text-sm text-text-secondary">
                No invites sent yet.
            </div>
        );
    }

    return (
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
                {invites.map((invite) => {
                    const status = getStatus(invite);
                    return (
                        <tr key={invite.token} className="border-b border-border last:border-0">
                            <td className="py-3 text-text-primary">{invite.inviteeEmail}</td>
                            <td className="py-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_BADGE[invite.assignedRole]}`}>
                                    {ROLE_LABEL[invite.assignedRole]}
                                </span>
                            </td>
                            <td className="py-3 font-mono text-xs text-text-secondary">
                                {invite.code}
                            </td>
                            <td className="py-3 text-text-secondary">
                                {status === "pending" ? timeLeft(invite.expiresAt) : "—"}
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
    );
}