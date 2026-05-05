import React from 'react'
import { Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material'

const COLORS = {
  blue:      '#1B6FEB',
  blueLight: '#EBF2FF',
  teal:      '#0ABFA3',
  border:    '#E4EAF2',
}

export function TaskCard({ task, navigate }) {
  return (
    <Card
      onClick={() => navigate(`/tasks/${task.id}`)}
      sx={{
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
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary', mb: 0.5, lineHeight: 1.3 }}>
          {task.title}
        </Typography>
        {task.description && (
          <Typography sx={{
            fontSize: 11, color: 'text.secondary', mb: 1, lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {task.description}
          </Typography>
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip
            label={task.objective_detail?.title || 'No Objective'}
            size="small"
            sx={{
              fontSize: 10, height: 18, bgcolor: COLORS.blueLight, color: COLORS.blue, fontWeight: 600,
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