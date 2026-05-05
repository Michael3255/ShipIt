import React from "react"
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Stack } from "@mui/material"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
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
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #1B6FEB 0%, #0ABFA3 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Stack direction="row" sx ={{ alignItems:"center", spacing:1.5 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(255,255,255,0.35)",
            }}
          >
            <RocketLaunchIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Avatar>
          <Typography
            variant="h6"
            component={Link}
            to="/projects"
            sx={{
              textDecoration: "none",
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.3px",
            }}
          >
            ShipIt
          </Typography>
        </Stack>

        {/* Nav */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[
            { label: "Projects", to: "/projects" },
            { label: "Teams",    to: "/teams"    },
          ].map(({ label, to }) => (
            <Button
              key={label}
              component={Link}
              to={to}
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                },
              }}
            >
              {label}
            </Button>
          ))}
          <Button
            onClick={handleLogout}
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontWeight: 600,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              borderRadius: 2,
              px: 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.15)",
                color: "#fff",
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