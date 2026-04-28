import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
<<<<<<< HEAD

import Login from "../pages/Login";
import Register from "../pages/Register";
import { ProjectsPage } from "../pages/ProjectsPage";
import { TeamsPage } from "../pages/TeamsPage";
import Dashboard from "../pages/Dashboard";
=======
import { ProjectsPage } from '../pages/ProjectsPage'
import Layout from '../components/Layout'
>>>>>>> 4b66bc6 (made some changes to layout)

function AppRoutes() {
    return (
        <AuthProvider>
            <Routes>
                {/* Default route */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectsPage />} />

                {/* Teams */}
                <Route path="/teams" element={<TeamsPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default AppRoutes;