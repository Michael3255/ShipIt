import React, { useState, useContext, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getProject } from '../api/projects'
import { getObjectives } from '../api/objectives'
import { getTasks } from '../api/tasks'
import { TaskCard } from './TaskCard'
import { KanbanListView } from './KanbanListView'
import PageContainer from './PageContainer'
import {
  Typography, Box, Chip, Button, Stack, Skeleton, Alert
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

function Column({ column, tasks, navigate }) {
  const meta = COLUMN_META[column.id] || COLUMN_META['To Do']

  return (
    <Box sx={{
      width: 280, minWidth: 280, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      bgcolor: meta.bg,
      border: `1.5px solid ${COLORS.border}`,
      borderTop: `3px solid ${meta.accent}`,
      borderRadius: 2,
      p: 1.5,
      gap: 1,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 80 }}>
        {tasks.length === 0 ? (
          <Box sx={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            py: 3, borderRadius: 1.5,
            border: `1.5px dashed ${COLORS.border}`,
          }}>
            <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>No tasks</Typography>
          </Box>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} navigate={navigate} />)
        )}
      </Box>
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

  const [tasks, setTasks]           = useState([])
  const [project, setProject]       = useState(null)
  const [objectives, setObjectives] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [viewMode, setViewMode]     = useState('board')
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
 // Derive active objective name for breadcrumb
  const activeObjective = objectives.find((o) => String(o.id) === String(objectiveFilter))
// Filter tasks
  const displayTasks = objectiveFilter
    ? tasks.filter((task) => String(task.objective) === String(objectiveFilter))
    : tasks

  const STATUS = Object.groupBy(displayTasks, ({ status }) => status)
// Breadcrumbs
  const breadcrumbs = [
    { title: 'Projects', path: '/projects' },
    { title: project?.title ?? 'Project', path: `/projects/${projectId}` },
    { title: activeObjective ? `Board · ${activeObjective.title}` : 'Board' },
  ]

  if (loading) return (
    <PageContainer title="Board" breadcrumbs={breadcrumbs}>
      <Stack direction="row" gap={2} sx={{ overflowX: 'auto', pb: 2 }}>
        {COLUMNS.map((col) => (
          <Box key={col.id} sx={{ width: 280, minWidth: 280, flexShrink: 0 }}>
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

      {/* Board View */}
      {viewMode === 'board' && (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, overflowX: 'auto', pb: 2, alignItems: 'flex-start' }}>
          {COLUMNS.map((column) => (
            <Column key={column.id} column={column} tasks={STATUS[column.id] ?? []} navigate={navigate} />
          ))}
        </Box>
      )}

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
    </PageContainer>
  )
}