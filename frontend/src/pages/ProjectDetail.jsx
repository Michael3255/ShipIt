import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { getProject } from "../api/projects"
import { getObjectives } from "../api/objectives"

import PageContainer from "../components/PageContainer"
import { Alert, Card, CardContent, Typography, Box, Button, LinearProgress, Chip, Stack } from "@mui/material"


export const ProjectDetails = ()=> {
  const { projectId } = useParams()
  const { accessToken } = useContext(AuthContext)

  const [ project, setProject ] = useState(null)
  const [ objectives, setObjectives ] = useState([])
  const [ objectivesLoading, setObjectivesLoading] = useState(true)
  const [ objectivesError, setObjectivesError ] = useState("")

  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState("")


  useEffect(() => {
    async function loadProject(){
      try {
        setLoading(true)
        setError("")

        const data = await getProject(projectId, accessToken)
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
  }, [projectId, accessToken])

  useEffect(() => {
    async function loadObjectives(){
      try {
        setObjectivesLoading(true)
        setObjectivesError("")

        const data = await getObjectives(projectId, accessToken)
        setObjectives(data)
      } catch(err){
        setObjectivesError(err.message)
      }finally {
        setObjectivesLoading(false)
      }
    }
    if (accessToken) {
      loadObjectives()
    }
  }, [projectId, accessToken])

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
        {/* Objective Card Section */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
          <Typography variant="h4" sx={{ mb: 2 }}>Objectives</Typography>
          <Button variant="contained" sx={{ mb: 2 }}>Add Objective</Button>
        </Stack>
        {objectivesError && <Alert severity="error">{objectivesError}</Alert>}
        
        {objectives.map((objective) => {
         const progress = objective.tasks_total > 0 
         ? (objective.tasks_done / objective.tasks_total) * 100 : 0
         return (
          <Card key={objective.id} sx={{ mb:2, cursor: 'pointer' }}>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography>{objective.title}</Typography>
              <Chip label={objective.status}/>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ my: 1 }} />
            <Typography variant="caption">
              {objective.tasks_done} / {objective.tasks_total} tasks completed
            </Typography>
          </CardContent>
         </Card> 
         )
         
        })} 

      </Box>

      
    </PageContainer>
  )
}