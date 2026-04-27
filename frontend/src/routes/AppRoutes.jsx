import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { ProjectsPage } from '../pages/ProjectsPage'
import { ObjectiveDetail } from '../pages/ObjectiveDetail'
import { TasksPage } from '../pages/TasksPage'
import { TaskDetail } from '../pages/TaskDetail'
import { TeamsPage } from "../pages/TeamsPage";

function AppRoutes() {
    return (
        <AuthProvider>
            <Routes>
                {/* Default route */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectsPage />} />

                {/* Objectives */}
                <Route path="/projects/:id" element={<ObjectiveDetail />} />

                {/* Tasks */}
                <Route path="/objectives/:id" element={<TasksPage />} />

                {/* Task Detail (comments) */}
                <Route path="/tasks/:id" element={<TaskDetail />} />

                {/* Teams */}
                <Route path="/teams" element={<TeamsPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default AppRoutes;