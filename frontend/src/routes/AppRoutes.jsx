import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";
import { ProjectsPage } from "../pages/ProjectsPage";

function AppRoutes() {
    return (
        <AuthProvider>
            <Routes>
                {/* Default route */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default AppRoutes;