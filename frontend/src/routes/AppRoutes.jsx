import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProjectsPage } from '../pages/ProjectsPage'

function AppRoutes() {
    return (
        <BrowserRouter>
        {/* Login Route */}

        {/* Projects Page route */}
            <Routes>
                <Route path="projects" element={<ProjectsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes