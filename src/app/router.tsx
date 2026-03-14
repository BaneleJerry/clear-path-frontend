import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuthStore } from "../store/authStore";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

export function AppRouter() {
    const { isAuthenticated } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
                />

                {/* Protected Routes */}
                <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
                    <Route path="/dashboard" element={<div>Dashboard Home</div>} />
                    <Route path="/projects" element={<div>Projects List</div>} />
                </Route>

                {/* Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}