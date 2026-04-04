import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Settings } from "lucide-react";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col p-4">
                <h1 className="text-xl font-bold text-blue-600 mb-8 px-2">Clear-Path</h1>
                <nav className="space-y-1">
                    <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
                        <LayoutDashboard className="mr-3 w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/projects" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
                        <FolderKanban className="mr-3 w-5 h-5" /> Projects
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
                    <span className="font-medium text-gray-500">Welcome Back</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500" />
                </header>
                <section className="flex-1 overflow-y-auto p-8">
                    <Outlet /> {/* This is where your pages will render */}
                </section>
            </main>
        </div>
    );
}