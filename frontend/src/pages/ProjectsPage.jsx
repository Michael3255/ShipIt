import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getProjects, createProject, editProject, deleteProject } from '../api/projects'
import { KanbanBoard } from '../components/KanbanBoard'

//MUI
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import PageContainer from '../components/PageContainer'
import Typography from '@mui/material/Typography'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import Icon from '@mui/material/Icon'
import DashboardIcon from '@mui/icons-material/Dashboard'

export const ProjectsPage = () => {

  const { accessToken } = useContext(AuthContext)

  //viewMode create and list
  const [viewMode, setViewMode]=useState('list')

  //hooks to manage states
  const [projects, setProjects]=useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  
  const [loading, setLoading]=useState(true)
  const [error, setError]=useState('')

  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const [formData, setFormData]=useState({
    title: '',
    description: '',
  })

  useEffect(() => {
    async function loadProjects(){
      try{
        setLoading(true)
        setError('')

        const data = await getProjects(accessToken)
        setProjects(data)
      }catch(err){
        setError(err.message)
      }finally{
        setLoading(false)
      }
    }
    if (accessToken){
      loadProjects()
    }
  }, [accessToken])

  console.log('accessToken:', accessToken)

  function handleChange(event){
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]:value,
    }))
  }

  async function handleSubmit(event){
    event.preventDefault()
    setError('')
    try{
      let savedProject

      if(viewMode === 'edit' && selectedProject){
        savedProject = await editProject(selectedProject.id, formData, accessToken)

        setProjects((prev) => prev.map((project) => 
          project.id === savedProject.id ? savedProject : project)
      )
      } else{
        savedProject = await createProject(formData, accessToken)
        setProjects((prev) => [...prev, savedProject])
      }
      setFormData({
        title:'',
        description: '',
      })
      setSelectedProject(null)
      setViewMode('list')
    } catch(err){
        setError(err.message)
      }
  }

  async function handleDelete(projectId){
    setError('')
    try{
      await deleteProject(projectId, accessToken)
      setProjects((prev) => prev.filter((project) => project.id !== projectId))

      if (selectedProject && selectedProject.id === projectId){
        setSelectedProject(null)
        setViewMode('list')
      }
    } catch(err){
      setError(err.message)
    }
  }

  function resetForm(){
    setError('')
    setFormData({
      title: '',
      description: '',
    })
    setSelectedProject(null)
  }

  if (loading) return null //<p>Loading Projects...</p>

  const isFormValid = formData.title !== '';

  if(viewMode === 'create' || viewMode === 'edit'){
    return(
      <PageContainer title={viewMode === 'edit' ? 'Edit Project' : 'Project'} breadcrumbs={[{title: viewMode === 'edit' ? 'Edit' : 'New'}]}>
          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          <Box
          component="form" onSubmit={handleSubmit} autoComplete='off' sx={{ width: '100%', mt: 2 }}>
            <FormGroup>
              <Grid container spacing= {2}>
                <Grid size={{ xs:12, sm: 6 }}>
                  <TextField fullWidth label="Project Title" name="title" value={formData.title} onChange={handleChange} sx={{ backgroundColor: 'gray', borderRadius: 1, input: { color: 'white'}, '& .MuiInputLabel-root': { color: 'grey.400'}, '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2'},
                  '& .MuiOutlinedInput-notchedOutline': {borderColor: '#1976d2',
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutLinedInput-notchedOutline': { borderColor: '1976d2' }
                  },
                }}/>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                  <TextField fullWidth label="Description"
                  name="description"
                  value={formData.description} onChange={handleChange} sx={{
                    backgroundColor: 'black', borderRadius: 1, input: { color: 'white'},
                    '& .MuiInputLabel-root': { color: 'grey.400'},
                    '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2'},
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '1976d2',
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '1976d2'}
                    },
                  }}/>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button type="button" variant="contained" onClick={() => setViewMode('list')}>Back</Button>

                <Button type="button" variant="contained" onClick={resetForm}>Cancel</Button>

                <Button type="submit" variant={isFormValid ? 'contained' : 'outlined'} disabled={!isFormValid}>{viewMode === 'edit' ? 'Save Changes' : 'Create Project'} </Button>
              </Box>
            </FormGroup>
          </Box>
        </PageContainer>
    )
  }

  if (viewMode === 'details' && selectedProject){
    return(
      <Container>
        <Typography variant='h4'>
          Project Details
        </Typography>
        <Card>
          <CardContent>
            <Typography>
              Title: {selectedProject.title || '-'}
            </Typography>
            <Typography>
              Description: {selectedProject.description || '-'}
            </Typography>
            <Typography>
              Owner: {selectedProject.owner || '-'}
            </Typography>
            <Typography>
              Team: {selectedProject.team || '-'}
            </Typography>
          </CardContent>
        </Card>
        <Box>
          <Button
            variant="contained" onClick={() => {
              setSelectedProject(null)
              setViewMode('list')
              }
            }
          >Back</Button>
        </Box>
      </Container>
    )
  }
  
  if (viewMode === 'board' && selectedProject){
    return <KanbanBoard project={selectedProject} />
  }

  return(
    <PageContainer title="Projects">
      {error && <Alert severity='error' sx = {{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={() => setViewMode('create')}>Add Project</Button>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Project Owner</TableCell>
                  <TableCell>Team</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No Projects Available</TableCell>
                  </TableRow>
                ):(
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Typography sx= {{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' }}}
                        onClick={() => {
                          setSelectedProject(project)
                          setViewMode('board')
                        }}
                        >{project.title}</Typography>
                      </TableCell>
                      <TableCell>
                        {project.description || '-'}
                      </TableCell>
                      <TableCell>
                        {project.owner || '-'}
                      </TableCell>
                      <TableCell>
                        {project.team || '-'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Project Details">
                          <IconButton onClick={() => {
                          setSelectedProject(project)
                          setViewMode('details')
                        }}><VisibilityIcon /> </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Project">
                          <IconButton onClick={() => {
                          setSelectedProject(project)
                          setFormData({
                            title: project.title || '',
                            description: project.description || '',
                            owner: project.owner || '',
                            team: project.team || ''
                          })
                          setViewMode('edit')
                        }}><ModeEditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
                          {confirmDeleteId === project.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant='caption'>Delete this project?</Typography>
                              <Button
                              size="small" variant='contained'
                              color='error' onClick={() => {
                              handleDelete(project.id)
                              setConfirmDeleteId(null)
                            }}
                          > Confirm
                          </Button>
                          <Button size="small"
                          variant='outlined'
                          onClick={() => setConfirmDeleteId(null)}>Cancel
                          </Button>
                        </Box>
                       ) : (
                        <IconButton onClick={() => setConfirmDeleteId(project.id)}>
                          <DeleteIcon />
                        </IconButton>
                       )}
                        </Tooltip>
                        
                       
                       <Tooltip title="Kanban Board">
                        <IconButton>
                          <DashboardIcon />
                        </IconButton> 
                       </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </PageContainer>
  )

}