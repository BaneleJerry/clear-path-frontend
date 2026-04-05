import { Outlet, Link, NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban } from "lucide-react";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-bg text-text-primary">

            <aside className="w-64 bg-surface border-r border-border flex flex-col p-4">
                <h1 className="text-xl font-bold text-primary mb-8 px-2">Clear-Path</h1>
                <nav className="space-y-1">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-text-secondary hover:bg-border/30 hover:text-text-primary"
                            }`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-text-secondary hover:bg-border/30 hover:text-text-primary"
                            }`
                        }
                    >
                        <FolderKanban className="w-5 h-5" /> Projects
                    </NavLink>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-surface border-b border-border flex items-center px-8 justify-between">
                    <span className="text-sm text-text-secondary">Welcome back</span>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">U</span>
                    </div>
                </header>
                <section className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </section>
            </main>

        </div>
    );
}