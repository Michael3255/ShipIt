import React, { useState, useContext, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getProject } from '../api/projects'
import { getObjectives } from '../api/objectives'
import { getTasks, createTask, editTask } from '../api/tasks'
import { KanbanListView } from './KanbanListView'

import { FormGroup, TextField, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, } from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

import PageContainer from './PageContainer'
import {
  Typography, Box, Chip, Button, Stack, Card,
  CardContent, Skeleton, Alert,
  Select,
  MenuItem
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'

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

// ─── Task Card ────────────────────────────────────────────────────


function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4:1,
  }

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{
      border: `1.5px solid ${COLORS.border}`,
      borderRadius: 2,
      boxShadow: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': {
        borderColor: COLORS.blue,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px rgba(27,111,235,0.10)`,
      },
    }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary', mb: 0.5, lineHeight: 1.3 }}>
          {task.title}
        </Typography>
        {task.description && (
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1, lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {task.description}
          </Typography>
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip
            label={task.objective_detail?.title ?? ''}
            size="small"
            sx={{ fontSize: 10, height: 18, bgcolor: COLORS.blueLight, color: COLORS.blue, fontWeight: 600,
              maxWidth: 140, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
            }}
          />
          <Box sx={{
            width: 24, height: 24, borderRadius: '50%',
            bgcolor: COLORS.teal, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
              {task.assigned_user?.[0]?.toUpperCase() ?? '?'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ---- Show Task Form
/* eslint-disable no-unused-vars */
function TaskForm({ column, objectives, objectiveFilter,formData,handleChange,handleSubmit, onCancel 
}){
  const isValid = formData.title !== "" && formData.due_date !== ""

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete='off'
      sx={{
        mb:3,
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
          {/* Add Drop down for objective */}
          <Grid>
            <Select name="objective" value={formData.objective}onChange={handleChange}>
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
function Column({ column, tasks, activeColumn, setActiveColumn, objectives, objectiveFilter, formData, handleChange, handleSubmit }) {
  const { setNodeRef , isOver } = useDroppable({ id: column.id })
  const meta = COLUMN_META[column.id] || COLUMN_META['To Do']

  return (
    <Box
      ref={setNodeRef} 
      sx={{
        width: 280, minWidth: 280, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        bgcolor: isOver ? meta.accent + '22' : meta.bg,  // ← subtle highlight
        border: `1.5px solid ${isOver ? meta.accent : COLORS.border}`,
        borderTop: `3px solid ${meta.accent}`,
        borderRadius: 2,
        p: 1.5,
        gap: 1,
        transition: 'all 0.15s ease',  // ← smooth transition
        minHeight: isOver ? 200 : 'auto',  // ← expands when dragging over
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
      {/* Task cards */}
       <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 120, flex:1 }}>
            {tasks.length === 0 ? (
              <Box sx={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                py: 3, borderRadius: 1.5,
                border: `1.5px dashed ${COLORS.border}`,
              }}>
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>No tasks</Typography>
              </Box>
            ) : (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
            </Box>
          </SortableContext>
            {activeColumn === column.id ? (
              <TaskForm
                column={column}
                objectives={objectives}
                objectiveFilter={objectiveFilter}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onCancel={() => setActiveColumn(null)}
              />
            ): (
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
  const { projectId }          = useParams()
  const [searchParams]         = useSearchParams()
  const navigate               = useNavigate()
  const { accessToken }        = useContext(AuthContext)
  const objectiveFilter        = searchParams.get('objective')
  const sensors                = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 }}))

  const [tasks, setTasks]               = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [activeTask, setActiveTask]     = useState(null)
  const [project, setProject]           = useState(null)
  const [viewMode, setViewMode]         = useState('board')
  const [objectives, setObjectives]        = useState([])
  const [activeColumn, setActiveColumn]      = useState(null)
  const [formData, setFormData] = useState({ title: "", description: "", status: "To Do", due_date: "", objective: objectiveFilter ?? "" })

  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

 function handleChange(event){
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value
    }))
 } 

  async function handleSubmit(event){
    event.preventDefault()
    try{
      const payload = {
        ...formData,
        status: activeColumn,
        objective: formData.objective || objectiveFilter,
      }
      const savedTasks = await createTask(payload.objective, payload, accessToken)
      setTasks((prev) => [...prev, savedTasks])
      setActiveColumn(null)
      setFormData({ title: "", description: "", status: "To Do", due_date: "", objective: objectiveFilter ?? ""})
    } catch(err){
        setError(err.message)
    }
  }

  function handleDragEnd(event){
    setActiveTask(null)
    const { active, over } = event
    if (!over) return // dropped outside returns back to original position

    const taskId = active.id

    const overIsColumn = COLUMNS.some(col => col.id === over.id)

    const newStatus = overIsColumn
      ? over.id
      : tasks.find(t => t.id === over.id)?.status

    if(!newStatus) return

    const task = tasks.find(t => t.id === taskId)
    if(!task || task.status === newStatus) return

    //updates
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ))

    //patch to API
    editTask(taskId, { status: newStatus }, accessToken)
      .catch(() => {
        setTasks(prev => prev.map( t => t.id === taskId ? { ...t, status: task.status } : t ))
        setError('Failed to update task status')
      })
  }

  // Fetch project title and objectives for breadcrumb + filter label
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [projectData, objectivesData, tasksData] = await Promise.all([
          getProject(projectId, accessToken),
          getObjectives(projectId, accessToken),
          getTasks({ project: projectId }, accessToken),
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
    if (accessToken && projectId) load()
  }, [projectId, accessToken])

  useEffect(() => {
    async function loadTasks(){
      try{
        setTasksLoading(true)
        const filters = objectiveFilter
        ? { objective: objectiveFilter }
        : { project : projectId }

        const data = await getTasks(filters, accessToken)
        setTasks(data)
      }catch(err){
        setError(err.message)
      }finally {
        setTasksLoading(false)
      }
    }
    if (accessToken && projectId) loadTasks()
  }, [projectId, objectiveFilter, accessToken])
 // Derive active objective name for breadcrumb
  const activeObjective = objectives.find((o) => String(o.id) === String(objectiveFilter))
  


  // Filter tasks
  const displayTasks = tasks

  const STATUS = Object.groupBy(displayTasks, ({ status }) => status)
// Breadcrumbs
  const breadcrumbs = [
    { title: 'Projects', path: '/projects' },
    { title: project?.title ?? 'Project', path: `/projects/${projectId}` },
    { title: activeObjective ? `Board · ${activeObjective.title}` : 'Board' },
  ]

  if (loading || tasksLoading ) return (
    <PageContainer title="Board" breadcrumbs={breadcrumbs}>
      <Stack direction="row" gap={2} sx={{ overflowX: 'auto', pb: 2 }}>
        {COLUMNS.map((col) => (
          <Box key={col.id} sx={{ width: 280, minWidth: 280, flexShrink: 0, minHeight: '500px'}}>
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

      {/* View toggle + filter banner */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        {objectiveFilter ? (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{
            px: 2, py: 1, bgcolor: COLORS.blueLight,
            border: `1.5px solid ${COLORS.blue}`, borderRadius: 2, flex: 1, mr: 2
          }}>
            <FilterListIcon sx={{ fontSize: 16, color: COLORS.blue }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.blue, flex: 1 }}>
              Showing tasks for: {activeObjective?.title ?? `Objective ${objectiveFilter}`}
            </Typography>
            <Button size="small" startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
              onClick={() => navigate(`/projects/${projectId}/board`)}
              sx={{ color: COLORS.blue, fontWeight: 700, textTransform: 'none', fontSize: 12, borderRadius: 1.5, '&:hover': { bgcolor: COLORS.blueDark, color: '#fff' } }}
            >
              Show all tasks
            </Button>
          </Stack>
        ) : <Box />}

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
              '&:hover': { bgcolor: COLORS.blueDark, color: '#fff' }
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
              '&:hover': { bgcolor: COLORS.blueDark, color: '#fff' }
            }}
          >
            List
          </Button>
        </Stack>
      </Stack>

      {/* List View */}
      {viewMode === 'list' && (
        <KanbanListView
          objectives={objectives}
          tasks={tasks}
          navigate={navigate}
          accessToken={accessToken}
          objectiveFilter={objectiveFilter}
          onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
          onTaskDeleted={(taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId))}
        />
      )}
      
        {/* Board */}
        {viewMode === 'board' && (
          <DndContext sensors={sensors} 
            onDragStart={(event) => {
              const task = tasks.find(t => t.id === event.active.id)
              setActiveTask(task)
            }} 
            onDragEnd={handleDragEnd}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                alignItems: 'flex-start',
              }}>
              {COLUMNS.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={STATUS[column.id] ?? []}
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
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} />: null}
            </DragOverlay>
          </DndContext>
        )}      
    </PageContainer>
  )
}