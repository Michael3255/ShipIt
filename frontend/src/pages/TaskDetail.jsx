import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getTask } from '../api/tasks'
import { getComments, createComment, editComment, deleteComment } from '../api/comments'

// MUI
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Toolbar from '@mui/material/Toolbar'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PageContainer from '../components/PageContainer'

export const TaskDetail = () => {
  const { accessToken } = useContext(AuthContext)
  const { id } = useParams()

  const [viewMode, setViewMode] = useState('list')
  const [comments, setComments] = useState([])
  const [task, setTask] = useState(null)
  const [selectedComment, setSelectedComment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const [formData, setFormData] = useState({
    body: '',
  })

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await getTask(id, accessToken)
        setTask(data)
      } catch (err) {
        setError(err.message)
      }
    }
    if (accessToken) loadTask()
  }, [accessToken, id])

  console.log('accessToken:', accessToken)
  console.log('id:', id)

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true)
        setError('')
        const data = await getComments(id, accessToken)
        setComments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) loadComments()
  }, [accessToken, id])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      let savedComment

      if (viewMode === 'edit' && selectedComment) {
        savedComment = await editComment(selectedComment.id, formData, accessToken)
        setComments((prev) =>
          prev.map((comment) => (comment.id === savedComment.id ? savedComment : comment))
        )
      } else {
        savedComment = await createComment(id, formData, accessToken)
        setComments((prev) => [...prev, savedComment])
      }

      setFormData({ body: '' })
      setSelectedComment(null)
      setViewMode('list')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(commentId) {
    setError('')
    try {
      await deleteComment(commentId, accessToken)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      if (selectedComment && selectedComment.id === commentId) {
        setSelectedComment(null)
        setViewMode('list')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function resetForm() {
    setError('')
    setFormData({ body: '' })
    setSelectedComment(null)
  }

  if (loading) return <p>Loading Comments...</p>

  const isFormValid = formData.body !== ''

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <PageContainer
        title={viewMode === 'edit' ? 'Edit Comment' : 'New Comment'}
        breadcrumbs={[{ title: viewMode === 'edit' ? 'Edit' : 'New' }]}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ width: '100%', mt: 2 }}>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Comment"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  sx={{
                    backgroundColor: 'gray', borderRadius: 1,
                    input: { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'grey.400' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button type="button" variant="contained" onClick={() => setViewMode('list')}>Back</Button>
              <Button type="button" variant="contained" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant={isFormValid ? 'contained' : 'outlined'} disabled={!isFormValid}>
                {viewMode === 'edit' ? 'Save Changes' : 'Add Comment'}
              </Button>
            </Box>
          </FormGroup>
        </Box>
      </PageContainer>
    )
  }

  if (viewMode === 'details' && selectedComment) {
    return (
      <Container>
        <Typography variant="h4">Comment Details</Typography>
        <Card>
          <CardContent>
            <Typography>Comment: {selectedComment.body || '-'}</Typography>
            <Typography>User: {selectedComment.user || '-'}</Typography>
            <Typography>Created: {selectedComment.created_at || '-'}</Typography>
          </CardContent>
        </Card>
        <Box>
          <Button variant="contained" onClick={() => { setSelectedComment(null); setViewMode('list') }}>
            Back
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {task && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">{task.title}</Typography>
            <Typography>Status: {task.status || '-'}</Typography>
            <Typography>Description: {task.description || '-'}</Typography>
            <Typography>Assigned To: {task.assigned_user || '-'}</Typography>
            <Typography>Due Date: {task.due_date || '-'}</Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Comments</Typography>
            <Button variant="contained" onClick={() => setViewMode('create')}>Add Comment</Button>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Comment</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No Comments Yet</TableCell>
                  </TableRow>
                ) : (
                  comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.body || '-'}</TableCell>
                      <TableCell>{comment.user || '-'}</TableCell>
                      <TableCell>{comment.created_at || '-'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => { setSelectedComment(comment); setViewMode('details') }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => {
                          setSelectedComment(comment)
                          setFormData({ body: comment.body || '' })
                          setViewMode('edit')
                        }}>
                          <ModeEditIcon />
                        </IconButton>
                        {confirmDeleteId === comment.id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption">Delete this comment?</Typography>
                            <Button size="small" variant="contained" color="error" onClick={() => { handleDelete(comment.id); setConfirmDeleteId(null) }}>
                              Confirm
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => setConfirmDeleteId(null)}>
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <IconButton onClick={() => setConfirmDeleteId(comment.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}

export default TaskDetail