
// Renders the list view of the Kanban board
// Groups tasks by objective — each objective is a collapsible section
// Supports inline task creation and deletion per objective group

import React from 'react'
import { Box, Typography } from '@mui/material'
import { ObjectiveGroup } from './ObjectiveGroup'

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  border: '#E4EAF2',
}

export function KanbanListView({ objectives, tasks, navigate, accessToken, onTaskCreated, onTaskDeleted, objectiveFilter }) {
  // If an objective filter is active, only show tasks for that objective
  const displayTasks = objectiveFilter
    ? tasks.filter((task) => String(task.objective) === String(objectiveFilter))
    : tasks

  return (
    <Box>
      {/* If no objectives exist yet */}
      {objectives.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, border: `1.5px dashed ${COLORS.border}`, borderRadius: 3 }}>
          <Typography sx={{ color: 'text.disabled' }}>No objectives yet</Typography>
        </Box>
      ) : (
        // Render one ObjectiveGroup per objective
        // Each group filters tasks to only show tasks belonging to that objective
        objectives.map((objective) => (
          <ObjectiveGroup
            key={objective.id}
            objective={objective}
            tasks={displayTasks.filter((t) => String(t.objective) === String(objective.id))}
            navigate={navigate}
            accessToken={accessToken}
            onTaskCreated={onTaskCreated}
            onTaskDeleted={onTaskDeleted}
          />
        ))
      )}
    </Box>
  )
}