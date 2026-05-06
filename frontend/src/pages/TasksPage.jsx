import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getTasks, createTask, editTask, deleteTask } from '../api/tasks'

// MUI
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
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PageContainer from '../components/PageContainer'

export const TasksPage = () => {
  const { accessToken } = useContext(AuthContext)
  const { objectiveId } = useParams()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState('list')
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    due_date: '',
    assigned_user: '',
  })

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true)
        setError('')
        const data = await getTasks({ objective: objectiveId }, accessToken)
        setTasks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) loadTasks()
  }, [accessToken, objectiveId])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      let savedTask

      if (viewMode === 'edit' && selectedTask) {
        savedTask = await editTask(selectedTask.id, formData, accessToken)
        setTasks((prev) =>
          prev.map((task) => (task.id === savedTask.id ? savedTask : task))
        )
      } else {
        savedTask = await createTask(objectiveId, formData, accessToken)
        setTasks((prev) => [...prev, savedTask])
      }

      setFormData({ title: '', description: '', status: '', due_date: '', assigned_user: '' })
      setSelectedTask(null)
      setViewMode('list')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(taskId) {
    setError('')
    try {
      await deleteTask(taskId, accessToken)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null)
        setViewMode('list')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function resetForm() {
    setError('')
    setFormData({ title: '', description: '', status: '', due_date: '', assigned_user: '' })
    setSelectedTask(null)
  }

  if (loading) return <p>Loading Tasks...</p>

  const isFormValid = formData.title !== '' && formData.due_date !== ''

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <PageContainer
        title={viewMode === 'edit' ? 'Edit Task' : 'New Task'}
        breadcrumbs={[{ title: viewMode === 'edit' ? 'Edit' : 'New' }]}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ width: '100%', mt: 2 }}>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Title" name="title"
                  value={formData.title} onChange={handleChange}
                  sx={{ backgroundColor: 'gray', borderRadius: 1, input: { color: 'white' }, '& .MuiInputLabel-root': { color: 'grey.400' }, '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Description" name="description"
                  value={formData.description} onChange={handleChange}
                  sx={{ backgroundColor: 'black', borderRadius: 1, input: { color: 'white' }, '& .MuiInputLabel-root': { color: 'grey.400' }, '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Status" name="status"
                  value={formData.status} onChange={handleChange}
                  sx={{ backgroundColor: 'black', borderRadius: 1, input: { color: 'white' }, '& .MuiInputLabel-root': { color: 'grey.400' }, '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                fullWidth label="Due Date" name="due_date" type="date"
                value={formData.due_date} onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ 
                    backgroundColor: 'black', borderRadius: 1, 
                    input: { color: 'white' }, 
                    '& .MuiInputLabel-root': { color: 'grey.400' }, 
                    '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)' }
                }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Assigned User" name="assigned_user"
                  value={formData.assigned_user} onChange={handleChange}
                  sx={{ backgroundColor: 'black', borderRadius: 1, input: { color: 'white' }, '& .MuiInputLabel-root': { color: 'grey.400' }, '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' } }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="button" variant="contained" onClick={() => setViewMode('list')}>Back</Button>
              <Button type="button" variant="contained" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant={isFormValid ? 'contained' : 'outlined'} disabled={!isFormValid}>
                {viewMode === 'edit' ? 'Save Changes' : 'Create Task'}
              </Button>
            </Box>
          </FormGroup>
        </Box>
      </PageContainer>
    )
  }

  if (viewMode === 'details' && selectedTask) {
    return (
      <Container>
        <Typography variant="h4">Task Details</Typography>
        <Card>
          <CardContent>
            <Typography>Title: {selectedTask.title || '-'}</Typography>
            <Typography>Description: {selectedTask.description || '-'}</Typography>
            <Typography>Status: {selectedTask.status || '-'}</Typography>
            <Typography>Due Date: {selectedTask.due_date || '-'}</Typography>
            <Typography>Assigned User: {selectedTask.assigned_user || '-'}</Typography>
          </CardContent>
        </Card>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => { setSelectedTask(null); setViewMode('list') }}>
            Back
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card>
        <CardContent>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Tasks</Typography>
            <Button variant="contained" onClick={() => setViewMode('create')}>Add Task</Button>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Assigned User</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>No Tasks Yet</TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title || '-'}</TableCell>
                      <TableCell>{task.description || '-'}</TableCell>
                      <TableCell>{task.status || '-'}</TableCell>
                      <TableCell>{task.due_date || '-'}</TableCell>
                      <TableCell>{task.assigned_user || '-'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => { setSelectedTask(task); setViewMode('details') }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => {
                          setSelectedTask(task)
                          setFormData({
                            title: task.title || '',
                            description: task.description || '',
                            status: task.status || '',
                            due_date: task.due_date || '',
                            assigned_user: task.assigned_user || '',
                          })
                          setViewMode('edit')
                        }}>
                          <ModeEditIcon />
                        </IconButton>
                        {confirmDeleteId === task.id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption">Delete this task?</Typography>
                            <Button size="small" variant="contained" color="error" onClick={() => { handleDelete(task.id); setConfirmDeleteId(null) }}>
                              Confirm
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => setConfirmDeleteId(null)}>
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <IconButton onClick={() => setConfirmDeleteId(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <Button
                          size="small" variant="outlined"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          View Comments
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}

export default TasksPage