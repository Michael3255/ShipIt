import React, { useState, useContext, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getProject } from '../api/projects'
import { getObjectives } from '../api/objectives'
import { getTasks, createTask, editTask } from '../api/tasks'
import { KanbanListView } from './KanbanListView'
import { TaskDrawer } from './TaskDrawer'
import { TaskCard } from './TaskCard'

import { FormGroup, TextField, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import PageContainer from './PageContainer'
import {
  Typography, Box, Chip, Button, Stack, Card,
  CardContent, Skeleton, Alert,
  Select,
  MenuItem
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'

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

const COLUMN_META = {
  'To Do':       { accent: '#94A3B8', bg: '#F8FAFC', chipBg: '#E2E8F0', chipColor: '#475569' },
  'In Progress': { accent: COLORS.blue,  bg: COLORS.blueLight, chipBg: '#C7DCFF', chipColor: COLORS.blueDark },
  'Done':        { accent: COLORS.teal,  bg: COLORS.tealLight, chipBg: '#A7F3E8', chipColor: '#065F52' },
}

const COLUMNS = [
  { id: 'To Do',       label: 'To Do'       },
  { id: 'In Progress', label: 'In Progress' },
  { id: 'Done',        label: 'Done'        },
]

const inputSx = {
  bgcolor: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset": { borderColor: COLORS.blue },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.blue },
}

// ─── Task Form (inline add task in board columns) ─────────────────
function TaskForm({ objectives, formData, handleChange, handleSubmit, onCancel }) {
  const isValid = formData.title !== "" && formData.due_date !== ""

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete='off'
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        border: `1.5px dashed ${COLORS.blue}`,
        bgcolor: COLORS.blueLight,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLORS.blue, mb: 2 }}>
        + Add Task
      </Typography>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth required
              label="Title"
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
          {/* Objective dropdown */}
          <Grid>
            <Select name="objective" value={formData.objective} onChange={handleChange}>
              {objectives.map((obj) => (
                <MenuItem key={obj.id} value={obj.id}>{obj.title}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <Select
                name="status"
                value={formData.status || "To Do"}
                onChange={handleChange}
                sx={inputSx}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={inputSx}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={1.5} mt={2.5}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid}
            sx={{
              bgcolor: COLORS.blue,
              "&:hover": { bgcolor: COLORS.blueDark },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            Add Task
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderColor: COLORS.blue,
              color: COLORS.blue,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: COLORS.blueLight },
            }}
          >
            Cancel
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  )
}

// ─── Column ───────────────────────────────────────────────────────
// Renders a single status column with task cards and inline add form
function Column({ column, tasks, onOpenDrawer, activeColumn, setActiveColumn, objectives, objectiveFilter, formData, handleChange, handleSubmit }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const meta = COLUMN_META[column.id] || COLUMN_META['To Do']

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: 280, minWidth: 280, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        bgcolor: isOver ? meta.accent + '22' : meta.bg,
        border: `1.5px solid ${isOver ? meta.accent : COLORS.border}`,
        borderTop: `3px solid ${meta.accent}`,
        borderRadius: 2,
        p: 1.5,
        gap: 1,
        transition: 'all 0.15s ease',
        minHeight: isOver ? 200 : 'auto',
      }}>
      {/* Column header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {column.label}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{ bgcolor: meta.chipBg, color: meta.chipColor, fontWeight: 700, fontSize: 11, height: 20 }}
        />
      </Stack>

      {/* Task cards — clicking opens TaskDrawer */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 120, flex: 1 }}>
          {tasks.length === 0 ? (
            <Box sx={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              py: 3, borderRadius: 1.5,
              border: `1.5px dashed ${COLORS.border}`,
            }}>
              <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>No tasks</Typography>
            </Box>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDrawer={onOpenDrawer} />
            ))
          )}
        </Box>
      </SortableContext>

      {/* Inline add task form or add button */}
      {activeColumn === column.id ? (
        <TaskForm
          objectives={objectives}
          objectiveFilter={objectiveFilter}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onCancel={() => setActiveColumn(null)}
        />
      ) : (
        <Button
          onClick={() => setActiveColumn(column.id)}
          sx={{ mt: 1, color: COLORS.blue, textTransform: 'none', fontWeight: 600 }}
        >
          + Add Task
        </Button>
      )}
    </Box>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export const KanbanBoard = () => {
  const { projectId }     = useParams()
  const [searchParams]    = useSearchParams()
  const navigate          = useNavigate()
  const { authFetch }     = useContext(AuthContext)
  const objectiveFilter   = searchParams.get('objective')
  const sensors           = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const [tasks, setTasks]                   = useState([])
  const [tasksLoading, setTasksLoading]     = useState(true)
  const [activeTask, setActiveTask]         = useState(null)
  const [project, setProject]               = useState(null)
  const [viewMode, setViewMode]             = useState('board')
  const [objectives, setObjectives]         = useState([])
  const [activeColumn, setActiveColumn]     = useState(null)
  const [formData, setFormData]             = useState({ title: "", description: "", status: "To Do", due_date: "", objective: objectiveFilter ?? "" })
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')

  // ── Drawer state ──
  const [drawerTaskId, setDrawerTaskId]     = useState(null)
  const [drawerOpen, setDrawerOpen]         = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const payload = {
        ...formData,
        status: activeColumn,
        objective: formData.objective || objectiveFilter,
      }
      const savedTasks = await createTask(payload.objective, payload, authFetch)
      setTasks((prev) => [...prev, savedTasks])
      setActiveColumn(null)
      setFormData({ title: "", description: "", status: "To Do", due_date: "", objective: objectiveFilter ?? "" })
    } catch (err) {
      setError(err.message)
    }
  }

  function handleDragEnd(event) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id
    const overIsColumn = COLUMNS.some(col => col.id === over.id)
    const newStatus = overIsColumn
      ? over.id
      : tasks.find(t => t.id === over.id)?.status

    if (!newStatus) return

    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return

    // update locally
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ))

    // patch to API — revert on failure
    editTask(taskId, { status: newStatus }, authFetch)
      .catch(() => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: task.status } : t))
        setError('Failed to update task status')
      })
  }

  // ── Opens the drawer with the selected task ──
  function handleOpenDrawer(taskId) {
    setDrawerTaskId(taskId)
    setDrawerOpen(true)
  }

  // ── Updates task in real time when saved from drawer ──
  function handleTaskUpdated(updatedTask) {
    setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t))
  }

  // ── Fetch project, objectives and all tasks on mount ──
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [projectData, objectivesData, tasksData] = await Promise.all([
          getProject(projectId, authFetch),
          getObjectives(projectId, authFetch),
          getTasks({ project: projectId }, authFetch),
        ])
        setProject(projectData)
        setObjectives(objectivesData)
        setTasks(tasksData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (authFetch && projectId) load()
  }, [projectId, authFetch])

  // ── Reload tasks when objective filter changes ──
  useEffect(() => {
    async function loadTasks() {
      try {
        setTasksLoading(true)
        const filters = objectiveFilter
          ? { objective: objectiveFilter }
          : { project: projectId }
        const data = await getTasks(filters, authFetch)
        setTasks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setTasksLoading(false)
      }
    }
    if (authFetch && projectId) loadTasks()
  }, [projectId, objectiveFilter, authFetch])

  // Derive active objective name for breadcrumb
  const activeObjective = objectives.find((o) => String(o.id) === String(objectiveFilter))

  const displayTasks = tasks
  const STATUS = Object.groupBy(displayTasks, ({ status }) => status)

  // Breadcrumbs
  const breadcrumbs = [
    { title: 'Projects', path: '/projects' },
    { title: project?.title ?? 'Project', path: `/projects/${projectId}` },
    { title: activeObjective ? `Board · ${activeObjective.title}` : 'Board' },
  ]

  // ── Loading skeleton ──
  if (loading || tasksLoading) return (
    <PageContainer title="Board" breadcrumbs={breadcrumbs}>
      <Stack direction="row" gap={2} sx={{ overflowX: 'auto', pb: 2 }}>
        {COLUMNS.map((col) => (
          <Box key={col.id} sx={{ width: 280, minWidth: 280, flexShrink: 0, minHeight: '500px' }}>
            <Skeleton variant="rounded" height={32} sx={{ mb: 1, borderRadius: 2 }} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 1, borderRadius: 2 }} />
            ))}
          </Box>
        ))}
      </Stack>
    </PageContainer>
  )

  return (
    <PageContainer
      title={project?.title ? `${project.title} — Board` : 'Board'}
      breadcrumbs={breadcrumbs}
    >
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      {/* ── View toggle + objective filter ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>

        {/* Objective filter dropdown — always visible */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <FilterListIcon sx={{ fontSize: 16, color: COLORS.blue, mr:2 }} />
          <FormControl size="small">
            <Select
              value={objectiveFilter || ''}
              onChange={(e) => {
                const val = e.target.value
                if (val) {
                  navigate(`/projects/${projectId}/board?objective=${val}`)
                } else {
                  navigate(`/projects/${projectId}/board`)
                }
              }}
              displayEmpty
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 13,
                color: COLORS.blue,
                minWidth: 160,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.blue, borderWidth: '1.5px' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.blueDark },
                '& .MuiSelect-icon': { color: COLORS.blue },
              }}
            >
              <MenuItem value="">All Objectives</MenuItem>
              {objectives.map((obj) => (
                <MenuItem key={obj.id} value={String(obj.id)}>{obj.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* View toggle buttons */}
        <Stack direction="row" spacing={0.5}>
          <Button
            variant={viewMode === 'board' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ViewKanbanIcon />}
            onClick={() => setViewMode('board')}
            sx={{
              textTransform: 'none', fontWeight: 700, borderRadius: 2,
              bgcolor: viewMode === 'board' ? COLORS.blue : 'transparent',
              borderColor: COLORS.blue, color: viewMode === 'board' ? '#fff' : COLORS.blue,
              '&:hover': { bgcolor: COLORS.blueDark, color: '#fff' }, ml:2
            }}
          >
            Board
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode('list')}
            sx={{
              textTransform: 'none', fontWeight: 700, borderRadius: 2,
              bgcolor: viewMode === 'list' ? COLORS.blue : 'transparent',
              borderColor: COLORS.blue, color: viewMode === 'list' ? '#fff' : COLORS.blue,
              '&:hover': { bgcolor: COLORS.blueDark, color: '#fff' }, mr:2,
            }}
          >
            List
          </Button>
        </Stack>
      </Stack>

      {/* ── List View — tasks grouped by objective ── */}
      {viewMode === 'list' && (
        <KanbanListView
          objectives={objectiveFilter
            ? objectives.filter((o) => String(o.id) === String(objectiveFilter))
            : objectives
          }
          tasks={tasks}
          authFetch={authFetch}
          objectiveFilter={objectiveFilter}
          onOpenDrawer={handleOpenDrawer}
          onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
          onTaskDeleted={(taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId))}
        />
      )}

      {/* ── Board View — tasks in status columns with drag and drop ── */}
      {viewMode === 'board' && (
        <DndContext
          sensors={sensors}
          onDragStart={(event) => {
            const task = tasks.find(t => t.id === event.active.id)
            setActiveTask(task)
          }}
          onDragEnd={handleDragEnd}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            overflowX: 'auto',
            pt:2,
            pb: 2,
            alignItems: 'flex-start',
          }}>
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={STATUS[column.id] ?? []}
                onOpenDrawer={handleOpenDrawer}
                activeColumn={activeColumn}
                setActiveColumn={setActiveColumn}
                objectives={objectives}
                objectiveFilter={objectiveFilter}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            ))}
          </Box>

          {/* Drag overlay — shows card while dragging */}
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onOpenDrawer={handleOpenDrawer} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── Task Drawer — slides out from right when task is clicked ── */}
      <TaskDrawer
        taskId={drawerTaskId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onTaskUpdated={handleTaskUpdated}
      />
    </PageContainer>
  )
}