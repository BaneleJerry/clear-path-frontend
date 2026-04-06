import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Users, Building2, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { fetchDashboardStats, fetchRecentInvites } from "../dashboardThunks";
import StatCard from "./StatCard";
import RecentInvitesTable from "./RecentInvitesTable";

const QUICK_ACTIONS = [
    { label: "Send a new invite", path: "/dashboard/invites", icon: Mail },
    { label: "Manage users", path: "/dashboard/users", icon: Users },
    { label: "Manage organisations", path: "/dashboard/organisations", icon: Building2 },
];

export default function AdminDashboard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { stats, recentInvites, statsLoading, invitesLoading } =
        useAppSelector((s) => s.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchRecentInvites());
    }, [dispatch]);

    return (
        <div className="flex flex-col gap-6">

            {/* Page title */}
            <div>
                <h2 className="text-lg font-medium">Overview</h2>
                <p className="text-sm text-text-secondary mt-0.5">
                    System-wide summary and recent activity
                </p>
            </div>

            {/* Stat cards */}
            <div className="flex gap-3">
                <StatCard label="Total users" value={stats?.totalUsers ?? "—"} loading={statsLoading} />
                <StatCard label="Pending invites" value={stats?.pendingInvites ?? "—"} loading={statsLoading} />
                <StatCard label="Organisations" value={stats?.totalOrganisations ?? "—"} loading={statsLoading} />
                <StatCard label="Active today" value={stats?.activeToday ?? "—"} loading={statsLoading} />
            </div>

            {/* Recent invites */}
            <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium">Recent invites</p>
                    <button
                        onClick={() => navigate("/invites")}
                        className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
                <RecentInvitesTable invites={recentInvites} loading={invitesLoading} />
            </div>

            {/* Quick actions */}
            <div className="bg-surface border border-border rounded-xl p-6">
                <p className="text-sm font-medium mb-4">Quick actions</p>
                <div className="flex flex-col gap-2">
                    {QUICK_ACTIONS.map(({ label, path, icon: Icon }) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg text-sm text-text-primary hover:bg-border/20 transition-colors text-left"
                        >
                            <Icon className="w-4 h-4 text-text-secondary" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}