import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProjectsPage } from '../pages/ProjectsPage'

function AppRoutes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Login Route */}

                    {/* Projects Page routes */}
                    <Route path="/projects" element={<ProjectsPage />} />
                </Routes>
            
            </AuthProvider> 
            
        </BrowserRouter>
    )
}

export default AppRoutes