import React from "react"
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Stack } from "@mui/material"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { Link } from "react-router-dom"

export default function Header() {
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
                        <Button color="inherit" component={Link} to="/projects">
                            Projects
                        </Button>
                        <Button color="inherit" component={Link} to="/teams">
                            Teams
                        </Button>
                        <Button color="inherit">
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}