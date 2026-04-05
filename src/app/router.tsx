import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../lib/store";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "../features/auth/components/LoginPage";
import RegisterPage from "../features/auth/components/RegisterPage";

/**
 * A wrapper for routes that require authentication.
 * If not authenticated, it redirects to login.
 */
const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

/**
 * A wrapper for auth pages (Login/Register).
 * If already authenticated, it redirects to dashboard.
 */
const PublicRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};

export function AppRouter() {
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    // 1. Master Guard: If Redux is still figuring out the session, 
    // we show nothing or a minimal spinner to prevent route jumping.
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 font-medium">Syncing session...</span>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* --- PUBLIC ROUTES --- */}
                <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* --- PROTECTED ROUTES --- */}
                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<div>Dashboard Home</div>} />
                        <Route path="/projects" element={<div>Projects List</div>} />
                        {/* Add more private routes here */}
                    </Route>
                </Route>

                {/* --- REDIRECTS & FALLBACKS --- */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}