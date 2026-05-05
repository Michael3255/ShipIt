import React from 'react'
import { Box, Typography } from '@mui/material'
import { ObjectiveGroup } from './ObjectiveGroup'

const COLORS = {
  border: '#E4EAF2',
}

export function KanbanListView({ objectives, tasks, navigate, accessToken, onTaskCreated, onTaskDeleted, objectiveFilter }) {
  const displayTasks = objectiveFilter
    ? tasks.filter((task) => String(task.objective) === String(objectiveFilter))
    : tasks

  return (
    <Box>
      {objectives.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, border: `1.5px dashed ${COLORS.border}`, borderRadius: 3 }}>
          <Typography sx={{ color: 'text.disabled' }}>No objectives yet</Typography>
        </Box>
      ) : (
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