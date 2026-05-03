import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getProjects, createProject, editProject, deleteProject } from '../api/projects'
import { KanbanBoard } from '../components/KanbanBoard'

// MUI
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import PageContainer from '../components/PageContainer'
import AddIcon from '@mui/icons-material/Add'
import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  blue:      '#1B6FEB',
  blueDark:  '#1358C4',
  blueLight: '#EBF2FF',
  teal:      '#0ABFA3',
  tealLight: '#E0FAF6',
  border:    '#E4EAF2',
  surface:   '#F7F9FC',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset':       { borderColor: COLORS.blue },
    '&.Mui-focused fieldset': { borderColor: COLORS.blue },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: COLORS.blue },
}

// ─── Empty State ──────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <Box sx={{
      textAlign: 'center', py: 8,
      border: `1.5px dashed ${COLORS.border}`,
      borderRadius: 3,
      bgcolor: COLORS.surface,
    }}>
      <FolderOpenIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
      <Typography sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
        No projects yet
      </Typography>
      <Typography sx={{ fontSize: 13, color: 'text.disabled', mb: 3 }}>
        Create your first project to get started
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{
          bgcolor: COLORS.blue,
          '&:hover': { bgcolor: COLORS.blueDark },
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 700,
        }}
      >
        Create Project
      </Button>
    </Box>
  )
}

// ─── Project Form ─────────────────────────────────────────────────
function ProjectForm({ viewMode, formData, handleChange, handleSubmit, onBack, onCancel, isFormValid }) {
  return (
    <PageContainer
      title={viewMode === 'edit' ? 'Edit Project' : 'New Project'}
      breadcrumbs={[
        { title: 'Projects', path: '/projects' },
        { title: viewMode === 'edit' ? 'Edit' : 'New' },
      ]}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          mt: 2, p: 3,
          border: `1.5px solid ${COLORS.border}`,
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        <FormGroup>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth required
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                size="small"
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                sx={inputSx}
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1.5} mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid}
              sx={{
                bgcolor: COLORS.blue,
                '&:hover': { bgcolor: COLORS.blueDark },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
              }}
            >
              {viewMode === 'edit' ? 'Save Changes' : 'Create Project'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderColor: COLORS.blue,
                color: COLORS.blue,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: COLORS.blueLight },
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={onBack}
              sx={{ color: 'text.secondary', borderRadius: 2, textTransform: 'none' }}
            >
              ← Back
            </Button>
          </Stack>
        </FormGroup>
      </Box>
    </PageContainer>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export const ProjectsPage = () => {
  const { accessToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const [viewMode, setViewMode]           = useState('list')
  const [projects, setProjects]           = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [formData, setFormData]           = useState({ title: '', description: '' })

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        setError('')
        const data = await getProjects(accessToken)
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) loadProjects()
  }, [accessToken])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      let savedProject
      if (viewMode === 'edit' && selectedProject) {
        savedProject = await editProject(selectedProject.id, formData, accessToken)
        setProjects((prev) => prev.map((p) => p.id === savedProject.id ? savedProject : p))
      } else {
        savedProject = await createProject(formData, accessToken)
        setProjects((prev) => [...prev, savedProject])
      }
      resetForm()
      setViewMode('list')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(projectId) {
    setError('')
    try {
      await deleteProject(projectId, accessToken)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
        setViewMode('list')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function resetForm() {
    setError('')
    setFormData({ title: '', description: '' })
    setSelectedProject(null)
  }

  const isFormValid = formData.title !== ''

  // ── Views ────────────────────────────────────────────────────────

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <ProjectForm
        viewMode={viewMode}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onBack={() => setViewMode('list')}
        onCancel={() => { resetForm(); setViewMode('list') }}
        isFormValid={isFormValid}
      />
    )
  }

  if (viewMode === 'board' && selectedProject) {
    return <KanbanBoard project={selectedProject} />
  }

  // ── List View ────────────────────────────────────────────────────
  return (
    <PageContainer
      title="Projects"
      breadcrumbs={[{ title: 'Projects' }]}
    >
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {/* Header row */}
      <Stack direction="row" justifycontent="space-between" alignitems="center" mb={3}>
        <Stack direction="row" alignitems="center" spacing={1.5}>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: 'text.primary' }}>
            All Projects
          </Typography>
          {!loading && (
            <Chip
              label={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                bgcolor: COLORS.blueLight,
                color: COLORS.blue,
                fontWeight: 700,
                fontSize: 11,
                height: 22,
              }}
            />
          )}
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setViewMode('create')}
          sx={{
            bgcolor: COLORS.blue,
            '&:hover': { bgcolor: COLORS.blueDark },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: `0 4px 12px rgba(27,111,235,0.25)`,
          }}
        >
          Add Project
        </Button>
      </Stack>

      {/* Loading skeletons */}
      {loading ? (
        <Box>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 2, mb: 1.5 }} />
          ))}
        </Box>
      ) : projects.length === 0 ? (
        <EmptyState onAdd={() => setViewMode('create')} />
      ) : (
        <Card sx={{
          border: `1.5px solid ${COLORS.border}`,
          borderRadius: 3,
          boxShadow: 'none',
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.surface }}>
                    {['Project', 'Description', 'Owner', 'Team', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                        color: 'text.secondary',
                        borderBottom: `1.5px solid ${COLORS.border}`,
                        py: 1.5,
                      }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project, index) => (
                    <TableRow
                      key={project.id}
                      sx={{
                        bgcolor: index % 2 === 0 ? 'background.paper' : COLORS.surface,
                        '&:hover': { bgcolor: COLORS.blueLight },
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Title — clickable to board */}
                      <TableCell>
                        <Typography
                          sx={{
                            cursor: 'pointer',
                            color: COLORS.blue,
                            fontWeight: 700,
                            fontSize: 14,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => {
                            setSelectedProject(project)
                            setViewMode('board')
                          }}
                        >
                          {project.title}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                        {project.description || '—'}
                      </TableCell>

                      <TableCell sx={{ fontSize: 13 }}>
                        {project.owner ? (
                          <Chip
                            label={project.owner}
                            size="small"
                            sx={{ bgcolor: COLORS.tealLight, color: COLORS.teal, fontWeight: 600, fontSize: 11 }}
                          />
                        ) : '—'}
                      </TableCell>

                      <TableCell sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {project.team || '—'}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack direction="row" alignitems="center" spacing={0.5}>
                          <Tooltip title="View Objectives">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/projects/${project.id}`)}
                              sx={{ color: COLORS.blue, '&:hover': { bgcolor: COLORS.blueLight } }}
                            >
                              <AssignmentIndTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Open Board">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedProject(project)
                                setViewMode('board')
                              }}
                              sx={{ color: COLORS.teal, '&:hover': { bgcolor: COLORS.tealLight } }}
                            >
                              <DashboardIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit Project">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedProject(project)
                                setFormData({
                                  title: project.title || '',
                                  description: project.description || '',
                                })
                                setViewMode('edit')
                              }}
                              sx={{ color: 'text.secondary', '&:hover': { bgcolor: COLORS.blueLight } }}
                            >
                              <ModeEditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Delete with inline confirm */}
                          {confirmDeleteId === project.id ? (
                            <Stack direction="row" alignitems="center" spacing={0.5}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                Delete?
                              </Typography>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, fontSize: 11, py: 0.3 }}
                                onClick={() => { handleDelete(project.id); setConfirmDeleteId(null) }}
                              >
                                Yes
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: 11, py: 0.3 }}
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                No
                              </Button>
                            </Stack>
                          ) : (
                            <Tooltip title="Delete Project">
                              <IconButton
                                size="small"
                                onClick={() => setConfirmDeleteId(project.id)}
                                sx={{ color: 'error.main', '&:hover': { bgcolor: '#FFF0F0' } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
