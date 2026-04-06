import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FolderKanban,
    Mail,
    Users,
    Building2,
    LogOut,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { logout } from "../../features/auth/authSlice";

const ADMIN_NAV = [
    { to: "/dashboard",          label: "Dashboard",      icon: LayoutDashboard },
    { to: "/dashboard/invites",  label: "Invites",        icon: Mail },          // ← fix path
    { to: "/dashboard/users",    label: "Users",          icon: Users },
    { to: "/dashboard/organisations", label: "Organisations", icon: Building2 },
    { to: "/dashboard/projects", label: "Projects",       icon: FolderKanban },
];

const STAFF_NAV = [
    { to: "/dashboard",         label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/invites", label: "Invites",   icon: Mail },
];


function getInitials(username: string | null): string {
    if (!username) return "U";
    return username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function DashboardLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { username, authorities } = useAppSelector((s) => s.auth);

    const isAdmin = authorities.includes("ROLE_ADMIN");
    const role = isAdmin
        ? "Admin"
        : authorities.includes("ROLE_STAFF")
            ? "Staff"
            : authorities.includes("ROLE_MODERATOR")
                ? "Moderator"
                : "User";

    const navItems = isAdmin ? ADMIN_NAV : STAFF_NAV;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <div className="flex h-screen bg-bg text-text-primary">

            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-border flex flex-col p-4">

                <h1 className="text-xl font-bold text-primary mb-8 px-2">
                    Clear-Path
                </h1>

                {/* Role badge */}
                <span className="px-2 mb-3 text-xs text-text-secondary uppercase tracking-widest">
                    {role}
                </span>

                {/* Nav links */}
                <nav className="space-y-1 flex-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-text-secondary hover:bg-border/30 hover:text-text-primary"
                                }`
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* User footer */}
                <div className="border-t border-border pt-4 mt-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-primary">
                                {getInitials(username)}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {username ?? "User"}
                            </p>
                            <p className="text-xs text-text-secondary">{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                        title="Log out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-surface border-b border-border flex items-center px-8 justify-between">
                    <span className="text-sm text-text-secondary">
                        Welcome back, {username ?? "there"}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                            {getInitials(username)}
                        </span>
                    </div>
                </header>
                <section className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </section>
            </main>

        </div>
    );
}