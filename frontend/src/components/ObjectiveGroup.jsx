import React, { useState } from 'react'
import {
  Box, Card, CardContent, Stack, Typography, Chip, Button,
  Alert, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Collapse
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { createTask, deleteTask } from '../api/tasks'

const COLORS = {
  blue:      '#1B6FEB',
  blueDark:  '#1358C4',
  blueLight: '#EBF2FF',
  teal:      '#0ABFA3',
  tealLight: '#E0FAF6',
  border:    '#E4EAF2',
  surface:   '#F7F9FC',
}

export function ObjectiveGroup({ objective, tasks, navigate, onTaskCreated, onTaskDeleted, accessToken }) {
  const [expanded, setExpanded] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', status: 'To Do', due_date: '' })
  const [error, setError] = useState('')

  async function handleCreateTask(e) {
    e.preventDefault()
    try {
      const saved = await createTask(objective.id, formData, accessToken)
      onTaskCreated(saved)
      setFormData({ title: '', description: '', status: 'To Do', due_date: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId, accessToken)
      onTaskDeleted(taskId)
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Card sx={{ mb: 2, border: `1.5px solid ${COLORS.border}`, borderRadius: 2, boxShadow: 'none' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>

        {/* Objective Header */}
        <Stack
          direction="row" justifyContent="space-between" alignItems="center"
          sx={{ px: 2, py: 1.5, bgcolor: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer' }}
          onClick={() => setExpanded(!expanded)}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{objective.title}</Typography>
            <Chip label={tasks.length} size="small" sx={{ bgcolor: COLORS.blueLight, color: COLORS.blue, fontWeight: 700, fontSize: 11, height: 20 }} />
          </Stack>
          <Button
            size="small" startIcon={<AddIcon />}
            onClick={(e) => { e.stopPropagation(); setShowForm(!showForm); setExpanded(true) }}
            sx={{ color: COLORS.blue, textTransform: 'none', fontWeight: 700, fontSize: 12 }}
          >
            Add Task
          </Button>
        </Stack>

        <Collapse in={expanded}>
          {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

          {/* Inline Add Form */}
          {showForm && (
            <Box component="form" onSubmit={handleCreateTask} sx={{ p: 2, bgcolor: COLORS.blueLight, borderBottom: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <TextField
                  size="small" label="Title" required
                  value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  sx={{ minWidth: 180 }}
                />
                <TextField
                  size="small" label="Description"
                  value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  sx={{ minWidth: 180 }}
                />
                <TextField
                  size="small" label="Due Date" type="date"
                  value={formData.due_date} onChange={(e) => setFormData(p => ({ ...p, due_date: e.target.value }))}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ minWidth: 160 }}
                />
                <Button type="submit" variant="contained" size="small"
                  disabled={!formData.title || !formData.due_date}
                  sx={{ bgcolor: COLORS.blue, '&:hover': { bgcolor: COLORS.blueDark }, textTransform: 'none', fontWeight: 700 }}
                >
                  Save
                </Button>
                <Button type="button" variant="outlined" size="small"
                  onClick={() => setShowForm(false)}
                  sx={{ borderColor: COLORS.blue, color: COLORS.blue, textTransform: 'none' }}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

          {/* Task Table */}
          {tasks.length === 0 && !showForm ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>No tasks yet</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: COLORS.surface }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} sx={{ '&:hover': { bgcolor: COLORS.blueLight } }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: COLORS.blue, cursor: 'pointer' }}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        {task.title}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, color: 'text.secondary' }}>{task.description || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            bgcolor: task.status === 'Done' ? COLORS.tealLight : task.status === 'In Progress' ? COLORS.blueLight : '#F0F2F5',
                            color: task.status === 'Done' ? '#065F52' : task.status === 'In Progress' ? COLORS.blue : '#475569',
                            fontWeight: 600, fontSize: 11
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{task.due_date || '-'}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <IconButton size="small" onClick={() => navigate(`/tasks/${task.id}`)} sx={{ color: COLORS.blue }}>
                            <ModeEditIcon fontSize="small" />
                          </IconButton>
                          {confirmDeleteId === task.id ? (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Typography variant="caption">Delete?</Typography>
                              <Button size="small" variant="contained" color="error"
                                sx={{ fontSize: 11, py: 0.3, textTransform: 'none' }}
                                onClick={() => handleDelete(task.id)}
                              >Yes</Button>
                              <Button size="small" variant="outlined"
                                sx={{ fontSize: 11, py: 0.3, textTransform: 'none' }}
                                onClick={() => setConfirmDeleteId(null)}
                              >No</Button>
                            </Stack>
                          ) : (
                            <IconButton size="small" onClick={() => setConfirmDeleteId(task.id)} sx={{ color: 'error.main' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Collapse>
      </CardContent>
    </Card>
  )
}