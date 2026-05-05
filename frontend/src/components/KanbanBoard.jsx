import React, { useState, useContext, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getProject } from '../api/projects'
import { getObjectives } from '../api/objectives'

import PageContainer from './PageContainer'
import {
  Typography, Box, Chip, Button, Stack, Card,
  CardContent, Skeleton, Alert
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  blue:        '#1B6FEB',
  blueDark:    '#1358C4',
  blueLight:   '#EBF2FF',
  teal:        '#0ABFA3',
  tealLight:   '#E0FAF6',
  border:      '#E4EAF2',
  surface:     '#F7F9FC',
}

const COLUMN_META = {
  'To Do':       { accent: '#94A3B8', bg: '#F8FAFC', chipBg: '#E2E8F0', chipColor: '#475569' },
  'In Progress': { accent: COLORS.blue,  bg: COLORS.blueLight, chipBg: '#C7DCFF', chipColor: COLORS.blueDark },
  'Done':        { accent: COLORS.teal,  bg: COLORS.tealLight, chipBg: '#A7F3E8', chipColor: '#065F52' },
}

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_TASKS = [
  { id: 1, title: 'Organize closet',              description: 'Complete research report',  status: 'Done',        objective: 'Expand market reach',           assignee: 'clafoy0',       objective_id: 2 },
  { id: 2, title: 'Schedule dentist appointment', description: 'Collaborate with team',     status: 'Done',        objective: 'Enhance brand awareness',        assignee: 'shartridge1',   objective_id: 2 },
  { id: 3, title: 'Start new book',               description: 'Update project status',     status: 'To Do',       objective: 'Optimize supply chain',          assignee: 'hhrihorovich2', objective_id: 2 },
  { id: 4, title: 'Fix login bug',                description: 'Complete research report',  status: 'To Do',       objective: 'Increase sales by 10%',          assignee: 'rmadders3',     objective_id: 1 },
  { id: 5, title: 'Go for a run',                 description: 'Conduct market analysis',   status: 'In Progress', objective: 'Increase social media presence', assignee: 'asolley4',      objective_id: 1 },
]

const COLUMNS = [
  { id: 'To Do',       label: 'To Do'       },
  { id: 'In Progress', label: 'In Progress' },
  { id: 'Done',        label: 'Done'        },
]

// ─── Task Card ────────────────────────────────────────────────────
function TaskCard({ task }) {
  return (
    <Card sx={{
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
            label={task.objective}
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
              {task.assignee?.[0]?.toUpperCase() ?? '?'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Column ───────────────────────────────────────────────────────
function Column({ column, tasks }) {
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
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
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

  const [tasks]                = useState(MOCK_TASKS)
  const [project, setProject]  = useState(null)
  const [objectives, setObjectives] = useState([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')

  // Fetch project title and objectives for breadcrumb + filter label
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [projectData, objectivesData] = await Promise.all([
          getProject(projectId, accessToken),
          getObjectives(projectId, accessToken),
        ])
        setProject(projectData)
        setObjectives(objectivesData)
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
    ? tasks.filter((task) => task.objective_id === Number(objectiveFilter))
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

      {/* Filter banner */}
      {objectiveFilter && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            mb: 2, px: 2, py: 1,
            bgcolor: COLORS.blueLight,
            border: `1.5px solid ${COLORS.blue}`,
            borderRadius: 2,
          }}
        >
          <FilterListIcon sx={{ fontSize: 16, color: COLORS.blue }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.blue, flex: 1 }}>
            Showing tasks for: {activeObjective?.title ?? `Objective ${objectiveFilter}`}
          </Typography>
          <Button
            size="small"
            startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate(`/projects/${projectId}/board`)}
            sx={{
              color: COLORS.blue,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: 12,
              borderRadius: 1.5,
              '&:hover': { bgcolor: COLORS.blueDark, color: '#fff' },
            }}
          >
            Show all tasks
          </Button>
        </Stack>
      )}

      {/* Board */}
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
          />
        ))}
      </Box>
    </PageContainer>
  )
}
