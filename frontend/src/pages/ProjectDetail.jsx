import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { getProject } from "../api/projects"

import PageContainer from "../components/PageContainer"
import { Alert, Card, CardContent, Typography, Box, Button } from "@mui/material"


export const ProjectDetails = ()=> {
  const { id } = useParams()
  const { accessToken } = useContext(AuthContext)

  const [ project, setProject ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState("")

  useEffect(() => {
    async function loadProject(){
      try {
        setLoading(true)
        setError("")

        const data = await getProject(id, accessToken)
        setProject(data)
      } catch(err) {
        setError(err.message)
      }finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      loadProject()
    }
  }, [id, accessToken])

  if (loading) return <PageContainer title="Project Details"> Loading...</PageContainer>

  if (error) return <PageContainer title="Project Details"><Alert severity="error">{error}</Alert></PageContainer>


  return (
    <PageContainer title="Project Details">
      {error && <Alert severity="error">{error}</Alert>}

      {project && (
        <Card>
          <CardContent>
            <Typography variant="h5">{project.title}</Typography>
            <Typography>Description: {project.description || "No Description"}</Typography>
            <Typography variant="body2">Owner: {project.owner}</Typography>
            <Typography variant="body2">
              Team: {project.team_detail || project.team || "-"}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Objectives</Typography>

        <Button variant="contained" sx={{ mb: 2 }}>Add Objective</Button>

        <Typography>No Objectives</Typography>
      </Box>

      
    </PageContainer>
  )
}