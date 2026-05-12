// TaskDrawer.jsx
// Slide-out drawer for viewing and editing a task inline
// Opens from the right side, closes when clicking outside
// Shows task details, editable fields, and full comment CRUD
// Only the comment owner can edit or delete their own comments

import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { getTask, editTask } from '../api/tasks'
import { getComments, createComment, editComment, deleteComment } from '../api/comments'
import { getTeamMembers } from '../api/users'

import {
  Drawer, Box, Typography, TextField, Button, Stack,
  Chip, Divider, IconButton, Alert, Select, MenuItem,
  FormControl, InputLabel, Avatar, Tooltip, CircularProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import SendIcon from '@mui/icons-material/Send'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  blue:        '#1B6FEB',
  blueDark:    '#1358C4',
  blueLight:   '#EBF2FF',
  blueMid:     '#C7DCFF',
  teal:        '#0ABFA3',
  tealDark:    '#088F79',
  tealLight:   '#E0FAF6',
  border:      '#E4EAF2',
  surface:     '#F7F9FC',
  textPrimary: '#0D1B2A',
  textMuted:   '#5C6E82',
  textLight:   '#98A8B8',
}

const STATUS_OPTIONS = ['No Status', 'To Do', 'In Progress', 'Done']

const STATUS_COLORS = {
  'No Status':   { bg: '#F0F2F5', color: '#475569' },
  'To Do':       { bg: '#F0F2F5', color: '#475569' },
  'In Progress': { bg: COLORS.blueLight, color: COLORS.blue },
  'Done':        { bg: COLORS.tealLight, color: COLORS.tealDark },
}

// ─── Shared input style ───────────────────────────────────────────
const inputSx = {
  bgcolor: '#fff',
  borderRadius: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': { borderColor: COLORS.blue },
    '&.Mui-focused fieldset': { borderColor: COLORS.blue },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: COLORS.blue },
}

// ─── Helper: decode JWT to get current user id ────────────────────
function getCurrentUserId() {
  const token = localStorage.getItem('access')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return String(payload.user_id)
  } catch {
    return null
  }
}

export function TaskDrawer({ taskId, open, onClose, onTaskUpdated }) {
  const { authFetch } = useContext(AuthContext)
  const currentUserId = getCurrentUserId()

  // ── Task state ──
  const [task, setTask] = useState(null)
  const [taskLoading, setTaskLoading] = useState(false)
  const [taskError, setTaskError] = useState('')

  // ── Edit task state ──
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    due_date: '',
    assigned_user: '',
  })
  const [saving, setSaving] = useState(false)

  // ── Team members state ──
  const [teamMembers, setTeamMembers] = useState([])

  // ── Comments state ──
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentBody, setEditingCommentBody] = useState('')
  const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState(null)
  const [commentError, setCommentError] = useState('')

  // ── Load task, team members, and comments when drawer opens ──
  useEffect(() => {
    if (!open || !taskId) return

    async function loadTask() {
      try {
        setTaskLoading(true)
        setTaskError('')
        const data = await getTask(taskId, authFetch)
        setTask(data)
        setFormData({
          title: data.title || '',
          description: data.description || '',
          status: data.status || 'To Do',
          due_date: data.due_date || '',
          assigned_user: data.assigned_user || '',
        })
      } catch (err) {
        setTaskError(err.message)
      } finally {
        setTaskLoading(false)
      }
    }

    async function loadTeamMembers() {
      try {
        const data = await getTeamMembers(authFetch)
        setTeamMembers(data)
      } catch (err) {
        console.error('Failed to load team members:', err)
      }
    }

    async function loadComments() {
      try {
        setCommentsLoading(true)
        const data = await getComments(taskId, authFetch)
        setComments(data)
      } catch (err) {
        setCommentError(err.message)
      } finally {
        setCommentsLoading(false)
      }
    }

    loadTeamMembers()
    loadTask()
    loadComments()
  }, [open, taskId, authFetch])

  // ── Save task edits and update board in real time ──
  async function handleSaveTask() {
    try {
      setSaving(true)
      setTaskError('')
      const updated = await editTask(task.id, formData, authFetch)
      setTask(updated)
      setEditMode(false)
      if (onTaskUpdated) onTaskUpdated(updated)
    } catch (err) {
      setTaskError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Add a new comment ──
  async function handleAddComment() {
    if (!newComment.trim()) return
    try {
      setCommentError('')
      const saved = await createComment(taskId, { body: newComment }, authFetch)
      setComments((prev) => [...prev, saved])
      setNewComment('')
    } catch (err) {
      setCommentError(err.message)
    }
  }

  // ── Save edited comment ──
  async function handleSaveComment(commentId) {
    try {
      setCommentError('')
      const updated = await editComment(commentId, { body: editingCommentBody }, authFetch)
      setComments((prev) => prev.map((c) => c.id === updated.id ? updated : c))
      setEditingCommentId(null)
      setEditingCommentBody('')
    } catch (err) {
      setCommentError(err.message)
    }
  }

  // ── Delete a comment ──
  async function handleDeleteComment(commentId) {
    try {
      setCommentError('')
      await deleteComment(commentId, authFetch)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      setConfirmDeleteCommentId(null)
    } catch (err) {
      setCommentError(err.message)
    }
  }

  // ── Reset state when drawer closes ──
  function handleClose() {
    setEditMode(false)
    setTaskError('')
    setCommentError('')
    setNewComment('')
    setEditingCommentId(null)
    setConfirmDeleteCommentId(null)
    onClose()
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
            width: { xs: '100%', sm: 560 },
            display: 'flex',
            flexDirection: 'column',
            height: '100%',        // full height
            overflowY: 'hidden',   // prevent outer scroll
            bgcolor: COLORS.surface,
            borderLeft: `1.5px solid ${COLORS.border}`,
        }
        }}
    >
      {/* ── Header ── */}
      <Box sx={{
        px: 3, py: 2,
        bgcolor: '#fff',
        borderBottom: `1.5px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TaskAltIcon sx={{ fontSize: 18, color: COLORS.blue }} />
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary }}>
            Task Detail
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small" sx={{ color: COLORS.textMuted }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Loading state ── */}
      {taskLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={24} sx={{ color: COLORS.blue }} />
        </Box>
      ) : taskError ? (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{taskError}</Alert>
        </Box>
      ) : task ? (
        <>
          {/* ── Task Info Section ── */}
          <Box sx={{ px: 3, py: 2.5, bgcolor: '#fff', borderBottom: `1.5px solid ${COLORS.border}` }}>
            {editMode ? (
              // ── Edit mode ──
              <Stack spacing={2}>
                <TextField
                  fullWidth size="small" label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  sx={inputSx}
                />
                <TextField
                  fullWidth size="small" label="Description" multiline rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  sx={inputSx}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                    sx={inputSx}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth size="small" label="Due Date" type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(p => ({ ...p, due_date: e.target.value }))}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={inputSx}
                />
                {/* Assign a user to task section */}
                <FormControl fullWidth size="small">
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    label="Assigned To"
                    value={formData.assigned_user || ''}
                    onChange={(e) => setFormData(p => ({ ...p, assigned_user: e.target.value }))}
                    sx={inputSx}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {teamMembers.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>                
                {taskError && <Alert severity="error" sx={{ borderRadius: 2 }}>{taskError}</Alert>}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained" size="small" disabled={saving}
                    onClick={handleSaveTask}
                    sx={{
                      bgcolor: COLORS.blue,
                      '&:hover': { bgcolor: COLORS.blueDark },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: `0 2px 8px rgba(27,111,235,0.25)`,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined" size="small"
                    onClick={() => { setEditMode(false); setTaskError('') }}
                    sx={{
                      borderColor: COLORS.blue,
                      color: COLORS.blue,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': { bgcolor: COLORS.blueLight },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : (
              // ── View mode ──
              <Stack spacing={2}>
                {/* Title + edit button */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography sx={{ fontWeight: 800, fontSize: 18, color: COLORS.textPrimary, flex: 1, lineHeight: 1.3 }}>
                    {task.title}
                  </Typography>
                  <Tooltip title="Edit task">
                    <IconButton
                      size="small"
                      onClick={() => setEditMode(true)}
                      sx={{
                        color: COLORS.blue,
                        bgcolor: COLORS.blueLight,
                        borderRadius: 1.5,
                        '&:hover': { bgcolor: COLORS.blueMid },
                      }}
                    >
                      <ModeEditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* Status chip */}
                <Chip
                  label={task.status || 'No Status'}
                  size="small"
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: STATUS_COLORS[task.status]?.bg || '#F0F2F5',
                    color: STATUS_COLORS[task.status]?.color || '#475569',
                    fontWeight: 700,
                    fontSize: 11,
                    height: 22,
                    border: 'none',
                  }}
                />

                {/* Description */}
                {task.description && (
                  <Typography sx={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>
                    {task.description}
                  </Typography>
                )}

                {/* Assigned to */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonIcon sx={{ fontSize: 14, color: COLORS.textLight }} />
                  <Typography sx={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
                    Assigned to:
                  </Typography>
                  {task.assigned_username ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: COLORS.teal }}>
                        {task.assigned_username[0]?.toUpperCase() ?? '?'}
                      </Avatar>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
                        {task.assigned_username}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: COLORS.textLight }}>Unassigned</Typography>
                  )}
                </Stack>

                {/* Due date */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon sx={{ fontSize: 14, color: COLORS.textLight }} />
                  <Typography sx={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>
                    Due:
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: COLORS.textPrimary }}>
                    {task.due_date || '—'}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>

            {/* ── Comments Section ── */}
            <Box sx={{ 
            px: 3, py: 2.5, 
            flex: 1,           // fill remaining space
            overflowY: 'auto', // scroll inside comments
            display: 'flex',
            flexDirection: 'column',
            }}>

            {/* Comments header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLORS.textPrimary }}>
                Comments
              </Typography>
              <Chip
                label={comments.length}
                size="small"
                sx={{ bgcolor: COLORS.blueLight, color: COLORS.blue, fontWeight: 700, fontSize: 11, height: 20 }}
              />
            </Stack>

            {commentError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{commentError}</Alert>}

            {/* ── Comment list ── */}
            <Stack spacing={1.5} sx={{ mb: 2.5, flex: 1 }}>
              {commentsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} sx={{ color: COLORS.blue }} />
                </Box>
              ) : comments.length === 0 ? (
                <Box sx={{
                  textAlign: 'center', py: 3,
                  border: `1.5px dashed ${COLORS.border}`,
                  borderRadius: 2,
                }}>
                  <Typography sx={{ fontSize: 12, color: COLORS.textLight }}>No comments yet</Typography>
                </Box>
              ) : (
                comments.map((comment) => {
                  // check if logged in user owns this comment using user_id
                  const isOwner = String(comment.user_id) === currentUserId
                  const isEditing = editingCommentId === comment.id
                  const isConfirmingDelete = confirmDeleteCommentId === comment.id

                  return (
                    <Box
                      key={comment.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#fff',
                        border: `1.5px solid ${COLORS.border}`,
                        transition: 'border-color 0.15s ease',
                        '&:hover': { borderColor: COLORS.blue },
                      }}
                    >
                      {/* Comment header — username + timestamp */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: COLORS.blue }}>
                            {comment.username?.[0]?.toUpperCase() ?? '?'}
                          </Avatar>
                          <Typography sx={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary }}>
                            {comment.username}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: COLORS.textLight }}>
                            {new Date(comment.created_at).toLocaleString()}
                          </Typography>
                        </Stack>

                        {/* Only show edit/delete for comment owner */}
                        {isOwner && !isEditing && (
                          <Stack direction="row" spacing={0.25}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingCommentId(comment.id)
                                setEditingCommentBody(comment.body)
                              }}
                              sx={{ color: COLORS.blue, '&:hover': { bgcolor: COLORS.blueLight } }}
                            >
                              <ModeEditIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                            {isConfirmingDelete ? (
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography variant="caption" sx={{ color: COLORS.textMuted }}>Delete?</Typography>
                                <IconButton size="small" onClick={() => handleDeleteComment(comment.id)} sx={{ color: 'error.main' }}>
                                  <CheckIcon sx={{ fontSize: 13 }} />
                                </IconButton>
                                <IconButton size="small" onClick={() => setConfirmDeleteCommentId(null)} sx={{ color: COLORS.textMuted }}>
                                  <CloseIcon sx={{ fontSize: 13 }} />
                                </IconButton>
                              </Stack>
                            ) : (
                              <IconButton size="small" onClick={() => setConfirmDeleteCommentId(comment.id)} sx={{ color: 'error.main', '&:hover': { bgcolor: '#FFF0F0' } }}>
                                <DeleteIcon sx={{ fontSize: 13 }} />
                              </IconButton>
                            )}
                          </Stack>
                        )}
                      </Stack>

                      {/* Comment body or edit field */}
                      {isEditing ? (
                        <Stack spacing={1}>
                          <TextField
                            fullWidth size="small" multiline rows={2}
                            value={editingCommentBody}
                            onChange={(e) => setEditingCommentBody(e.target.value)}
                            sx={inputSx}
                          />
                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="contained"
                              onClick={() => handleSaveComment(comment.id)}
                              sx={{
                                bgcolor: COLORS.blue,
                                '&:hover': { bgcolor: COLORS.blueDark },
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                fontSize: 11,
                              }}
                            >
                              Save
                            </Button>
                            <Button size="small" variant="outlined"
                              onClick={() => { setEditingCommentId(null); setEditingCommentBody('') }}
                              sx={{
                                borderColor: COLORS.blue,
                                color: COLORS.blue,
                                textTransform: 'none',
                                borderRadius: 2,
                                fontSize: 11,
                                '&:hover': { bgcolor: COLORS.blueLight },
                              }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Typography sx={{ fontSize: 12, color: COLORS.textPrimary, lineHeight: 1.6 }}>
                          {comment.body}
                        </Typography>
                      )}
                    </Box>
                  )
                })
              )}
            </Stack>

            {/* ── Add Comment ── */}
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              border: `1.5px solid ${COLORS.border}`,
              bgcolor: '#fff',
            }}>
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  fullWidth size="small" multiline maxRows={3}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    // submit on Enter, allow Shift+Enter for new line
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
                <IconButton
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{
                    color: COLORS.blue,
                    bgcolor: COLORS.blueLight,
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: COLORS.blueMid },
                    '&:disabled': { color: COLORS.textLight, bgcolor: 'transparent' },
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </>
      ) : null}
    </Drawer>
  )
}