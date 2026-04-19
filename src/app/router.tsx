import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../lib/store";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "../features/dashboard/components/AdminDashboard";
import InvitesPage from "../features/invite/components/InvitePage";
import LoginPage from "../features/auth/components/LoginPage";
import RegisterPage from "../features/auth/components/RegisterPage";
import UsersPage from "../features/user/components/UserPage";
import OrgPage from "../features/organization/components/OrgPage";
import ProjectPage from "../features/projects/Components/ProjectPage";

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
};

const PublicRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};

export function AppRouter() {
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="ml-3 text-gray-600 font-medium">Syncing session...</span>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC */}
                <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* PROTECTED */}
                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/dashboard/invites" element={<InvitesPage />} />
                        <Route path="/dashboard/users" element={<UsersPage />} />
                        <Route path="/dashboard/projects" element={<ProjectPage />} />
                        <Route path="/dashboard/organisations" element={<OrgPage />} />
                    </Route>
                </Route>

                {/* FALLBACKS */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}