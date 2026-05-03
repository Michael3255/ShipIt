import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { ProjectsPage } from '../pages/ProjectsPage'
import { ProjectDetails } from "../pages/ProjectDetail";
import { ObjectiveDetail } from '../pages/ObjectiveDetail'
import { TasksPage } from '../pages/TasksPage'
import { TaskDetail } from '../pages/TaskDetail'
import { TeamsPage } from "../pages/TeamsPage";
import { KanbanBoard } from "../components/KanbanBoard";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout"

function AppRoutes() {
    return (
        <AuthProvider>
            <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* With Header */}
            <Route element={<Layout />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Teams */}
                <Route path="/teams" element={<TeamsPage />} />
                
                {/* Project list */}
                <Route path="/projects" element={<ProjectsPage />} />
                
                {/* Project detail */}
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                
                {/* Objective detail */}
                <Route path="/objectives/:objectiveId" element={<ObjectiveDetail />} />

                {/* Objective → tasks */}
                <Route path="/objectives/:objectiveId/tasks" element={<TasksPage />} />

                {/* ProjectId -> board */}
                <Route path="/projects/:projectId/board" element={ <KanbanBoard /> } />

                {/* Task Detail */}
                <Route path="/tasks/:taskId" element={<TaskDetail />} />
            </Route>
        </Routes>
        </AuthProvider>
    );
}

export default AppRoutes;