import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProjectsPage } from '../pages/ProjectsPage'
import { ObjectiveDetail } from '../pages/ObjectiveDetail'
import { TasksPage } from '../pages/TasksPage'
import { TaskDetail } from '../pages/TaskDetail'

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Login Route */}

                    {/* Projects Page routes */}
                    <Route path="/projects" element={<ProjectsPage />} />

                    {/* Objectives Page routes */}
                    <Route path="/projects/:id" element={<ObjectiveDetail />} />

                    {/* Tasks Page routes */}
                    <Route path="/objectives/:id" element={<TasksPage />} />

                    {/* Tasks Detail routes (comments on a task) */}
                    <Route path="/tasks/:id" element={<TaskDetail />} />
                </Routes>
            
            </AuthProvider> 
            
        </BrowserRouter>
    )
}

export default AppRoutes