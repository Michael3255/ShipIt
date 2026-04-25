import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProjectsPage } from '../pages/ProjectsPage'
import { TeamsPage } from '../pages/TeamsPage'

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Login Route */}

                    {/* Projects Page routes */}
                    <Route path="/projects" element={<ProjectsPage />} />

                    {/* Teams */}
                    <Route path="/teams" element={<TeamsPage />} />
                </Routes>
            
            </AuthProvider> 
            
        </BrowserRouter>
    )
}

export default AppRoutes