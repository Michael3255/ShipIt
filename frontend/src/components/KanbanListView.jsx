// Renders the list view of the Kanban board
// Groups tasks by objective — each objective is a collapsible section
// Supports inline task creation and deletion per objective group
import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { ObjectiveGroup } from './ObjectiveGroup'

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  border: '#E4EAF2',
  bg: '#F7F9FC',
  emptyText: '#8A94A6',
}

export function KanbanListView({
  objectives,
  tasks,
  authFetch,
  onTaskCreated,
  onTaskDeleted,
  objectiveFilter,
  onOpenDrawer,
}) {
  const displayTasks = objectiveFilter
    ? tasks.filter((task) => String(task.objective) === String(objectiveFilter))
    : tasks

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 3,
        minHeight: '70vh',
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: COLORS.blue,
        }}
      >
        Objectives
      </Typography>

      {/* Empty state */}
      {objectives.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: `1.5px dashed ${COLORS.border}`,
            borderRadius: 3,
            backgroundColor: '#fff',
          }}
        >
          <Typography sx={{ color: COLORS.emptyText, fontSize: 14 }}>
            No objectives yet — create one to get started
          </Typography>
        </Box>
      ) : (
        // Objective groups
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {objectives.map((objective) => (
            <Box
              key={objective.id}
              sx={{
                backgroundColor: '#fff',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                p: 1.5,
                transition: '0.2s',
                '&:hover': {
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                },
              }}
            >
              <ObjectiveGroup
                objective={objective}
                tasks={displayTasks.filter(
                  (t) => String(t.objective) === String(objective.id)
                )}
                authFetch={authFetch}
                onTaskCreated={onTaskCreated}
                onTaskDeleted={onTaskDeleted}
                onOpenDrawer={onOpenDrawer}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  )
}