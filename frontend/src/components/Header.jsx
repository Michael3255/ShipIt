import React, { useContext } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Stack,
} from "@mui/material"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

export default function Header() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
        
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 4 },
          py: 1,
        }}
      >
        {/* Logo Section */}
        <Stack
          direction="row"
          sx={{ alignItems: "center", spacing: 1.5 }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              background:
                "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              boxShadow: "0 4px 14px rgba(124,58,237,0.45)",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <RocketLaunchIcon sx={{ fontSize: 22, color: "#fff" }} />
          </Avatar>

          <Typography
            variant="h6"
            component={Link}
            to="/projects"
            sx={{
              textDecoration: "none",
              color:"#1358C4",
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: "-0.6px",
              transition: "0.2s ease",
              '&:hover': {
                opacity: 0.85,
              },
             ml:2 
            }}
          >
            ShipIt
          </Typography>
        </Stack>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            
          }}
        >
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Projects", to: "/projects" },
            { label: "Teams", to: "/teams" },
          ].map(({ label, to }) => (
            <Button
              key={label}
              component={Link}
              to={to}
              sx={{
                color:"#1358C4",
                fontWeight: 600,
                fontSize: 14,
                textTransform: "none",
                px: 2.2,
                py: 1,
                borderRadius: "12px",
                transition: "all 0.2s ease",
                '&:hover': {
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {label}
            </Button>
          ))}

          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              ml: 1,
              background:
                "linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "12px",
              px: 2.5,
              textTransform: "none",
              boxShadow: "0 6px 18px rgba(244,63,94,0.35)",
              '&:hover': {
                background:
                  "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 20px rgba(244,63,94,0.45)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}