import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/store"; 
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

export function AppRouter() {
    // Use the Redux selector instead of useAuthStore
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading session...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes - Redirect to dashboard if already logged in */}
                <Route
                    path="/login"
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
                />

                {/* Protected Routes - Redirect to login if not authenticated */}
                <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}>
                    <Route path="/dashboard" element={<div>Dashboard Home</div>} />
                    <Route path="/projects" element={<div>Projects List</div>} />
                </Route>

                {/* Fallback */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}