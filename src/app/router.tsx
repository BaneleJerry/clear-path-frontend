import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuthStore } from "../store/authStore";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

export function AppRouter() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialLoading = useAuthStore((state) => state.isInitialLoading);

    if (isInitialLoading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
                />

                <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}>
                    <Route path="/dashboard" element={<div>Dashboard Home</div>} />
                    <Route path="/projects" element={<div>Projects List</div>} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}