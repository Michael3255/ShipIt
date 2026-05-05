import React from "react"
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Stack } from "@mui/material"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
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
        <Box sx={{ flexGrow: 1, mb: 4 }}> {/*  Space below header */}
            <AppBar position='static' elevation={1}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Stack direction="row" spacing={2}>
                        <Typography variant='h6'
                        component={Link}
                        to="/projects"
                        sx={{ textDecoration: "none", colors: "inherit", fontWeight: 700}}>
                            ShipIt
                        </Typography>
                        <Avatar><RocketLaunchIcon /></Avatar>
                    </Stack>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button color="inherit" component={Link} to="/dashboard">
                            Dashboard
                        </Button>
                        <Button color="inherit" component={Link} to="/projects">
                            Projects
                        </Button>
                        <Button color="inherit" component={Link} to="/teams">
                            Teams
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}