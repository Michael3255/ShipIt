import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getObjectives, createObjective, editObjective, deleteObjective } from '../api/objectives'

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

export const ObjectiveDetail = () => {
  const { accessToken } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState('list')
  const [objectives, setObjectives] = useState([])
  const [selectedObjective, setSelectedObjective] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    due_date: '',
  })

  useEffect(() => {
    async function loadObjectives() {
      try {
        setLoading(true)
        setError('')
        const data = await getObjectives(id, accessToken)
        setObjectives(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) loadObjectives()
  }, [accessToken, id])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      let savedObjective

      if (viewMode === 'edit' && selectedObjective) {
        savedObjective = await editObjective(selectedObjective.id, formData, accessToken)
        setObjectives((prev) =>
          prev.map((obj) => (obj.id === savedObjective.id ? savedObjective : obj))
        )
      } else {
        savedObjective = await createObjective(id, formData, accessToken)
        setObjectives((prev) => [...prev, savedObjective])
      }

      setFormData({ title: '', description: '', status: '', due_date: '' })
      setSelectedObjective(null)
      setViewMode('list')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(objectiveId) {
    setError('')
    try {
      await deleteObjective(objectiveId, accessToken)
      setObjectives((prev) => prev.filter((obj) => obj.id !== objectiveId))
      if (selectedObjective && selectedObjective.id === objectiveId) {
        setSelectedObjective(null)
        setViewMode('list')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function resetForm() {
    setError('')
    setFormData({ title: '', description: '', status: '', due_date: '' })
    setSelectedObjective(null)
  }

  if (loading) return <p>Loading Objectives...</p>

  const isFormValid = formData.title !== '' && formData.due_date !== ''

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <PageContainer
        title={viewMode === 'edit' ? 'Edit Objective' : 'New Objective'}
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
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="button" variant="contained" onClick={() => setViewMode('list')}>Back</Button>
              <Button type="button" variant="contained" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant={isFormValid ? 'contained' : 'outlined'} disabled={!isFormValid}>
                {viewMode === 'edit' ? 'Save Changes' : 'Create Objective'}
              </Button>
            </Box>
          </FormGroup>
        </Box>
      </PageContainer>
    )
  }

  if (viewMode === 'details' && selectedObjective) {
    return (
      <Container>
        <Typography variant="h4">Objective Details</Typography>
        <Card>
          <CardContent>
            <Typography>Title: {selectedObjective.title || '-'}</Typography>
            <Typography>Description: {selectedObjective.description || '-'}</Typography>
            <Typography>Status: {selectedObjective.status || '-'}</Typography>
            <Typography>Due Date: {selectedObjective.due_date || '-'}</Typography>
          </CardContent>
        </Card>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => { setSelectedObjective(null); setViewMode('list') }}>
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
            <Typography variant="h6">Objectives</Typography>
            <Button variant="contained" onClick={() => setViewMode('create')}>Add Objective</Button>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {objectives.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No Objectives Yet</TableCell>
                  </TableRow>
                ) : (
                  objectives.map((objective) => (
                    <TableRow key={objective.id}>
                      <TableCell>{objective.title || '-'}</TableCell>
                      <TableCell>{objective.description || '-'}</TableCell>
                      <TableCell>{objective.status || '-'}</TableCell>
                      <TableCell>{objective.due_date || '-'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => { setSelectedObjective(objective); setViewMode('details') }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => {
                          setSelectedObjective(objective)
                          setFormData({
                            title: objective.title || '',
                            description: objective.description || '',
                            status: objective.status || '',
                            due_date: objective.due_date || '',
                          })
                          setViewMode('edit')
                        }}>
                          <ModeEditIcon />
                        </IconButton>
                        {confirmDeleteId === objective.id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption">Delete this objective?</Typography>
                            <Button size="small" variant="contained" color="error" onClick={() => { handleDelete(objective.id); setConfirmDeleteId(null) }}>
                              Confirm
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => setConfirmDeleteId(null)}>
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <IconButton onClick={() => setConfirmDeleteId(objective.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <Button
                          size="small" variant="outlined"
                          onClick={() => navigate(`/objectives/${objective.id}/tasks`)}
                        >
                          View Tasks
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

export default ObjectiveDetail