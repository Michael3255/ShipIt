import { Outlet } from "react-router-dom"
import Header from "./Header"
import { Box } from "@mui/material"

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, pt: 1.5, pb: 4 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
