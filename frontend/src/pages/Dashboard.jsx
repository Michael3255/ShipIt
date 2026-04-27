import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import { getTeams } from "../api/teams";
import { getProjects } from "../api/projects";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const [teamCount, setTeamCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const teams = await getTeams(accessToken);
        const projects = await getProjects(accessToken);

        setTeamCount(teams.length);
        setProjectCount(projects.length);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <Container>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Dashboard
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={() => navigate("/teams")}>
                New Team
              </Button>

              <Button variant="contained" onClick={() => navigate("/projects")}>
                New Project
              </Button>
            </Box>
          </Toolbar>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome back
            </Typography>

            <Typography>
              This is your central place to view your workspace. Get started with
              Teams or Projects.
            </Typography>

            {/* Hero Image */}
            <Box sx={{ mt: 2 }}>
              <img
                src="/src/assets/dashboard.jpg"
                alt="Workspace"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Box>
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Teams</Typography>

                  <Typography variant="h4" sx={{ my: 1 }}>
                    {loading ? "..." : teamCount}
                  </Typography>

                  <Typography>
                    Total teams currently available in ShipIt.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Projects</Typography>

                  <Typography variant="h4" sx={{ my: 1 }}>
                    {loading ? "..." : projectCount}
                  </Typography>

                  <Typography>
                    Total projects currently available in ShipIt.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}