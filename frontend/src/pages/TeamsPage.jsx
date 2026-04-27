import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getTeams, createTeam, editTeam, deleteTeam } from '../api/teams'

import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Toolbar from '@mui/material/Toolbar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'

export const TeamsPage = () => {
  const { accessToken } = useContext(AuthContext)

  const [teams, setTeams] = useState([])
  const [title, setTitle] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true)
        setError('')

        const data = await getTeams(accessToken)
        setTeams(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      loadTeams()
    } else {
      setLoading(false)
    }
  }, [accessToken])

  async function handleSubmitTeam(event) {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a team name')
      return
    }

    try {
      if (isEditing && selectedTeam) {
        const updatedTeam = await editTeam(selectedTeam.id, { title }, accessToken)

        setTeams((prev) =>
          prev.map((team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          )
        )

        setSelectedTeam(null)
        setIsEditing(false)
      } else {
        const newTeam = await createTeam({ title }, accessToken)
        setTeams((prev) => [...prev, newTeam])
      }

      setTitle('')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEditClick(team) {
    setSelectedTeam(team)
    setTitle(team.title)
    setIsEditing(true)
    setError('')
  }

  async function handleDeleteTeam(teamId) {
    setError('')

    try {
      await deleteTeam(teamId, accessToken)
      setTeams((prev) => prev.filter((team) => team.id !== teamId))
      setConfirmDeleteId(null)

      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam(null)
        setIsEditing(false)
        setTitle('')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function handleCancelEdit() {
    setSelectedTeam(null)
    setIsEditing(false)
    setTitle('')
    setError('')
  }

  if (loading) return <p>Loading Teams...</p>

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Teams</Typography>

            <Button variant="contained" type="submit" form="team-form">
              {isEditing ? 'SAVE TEAM' : 'CREATE TEAM'}
            </Button>
          </Toolbar>

          <Box
            component="form"
            id="team-form"
            onSubmit={handleSubmitTeam}
            sx={{ mb: 4 }}
          >
            <TextField
              fullWidth
              placeholder="Enter team title here..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            {isEditing && (
              <Box sx={{ mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </Button>
              </Box>
            )}
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mt: 3, mb: 1 }}
          >
            Team Directory
          </Typography>

          <Table>
            <TableBody>
              {teams.length === 0 ? (
                <TableRow>
                  <TableCell>
                    No teams yet. Create your first team above.
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((team) => (
                  <TableRow key={team.id}>

                    {/* LEFT: EDIT + NAME */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => handleEditClick(team)}>
                          <ModeEditIcon />
                        </IconButton>

                        <Typography>{team.title}</Typography>
                      </Box>
                    </TableCell>

                    {/* RIGHT: DELETE */}
                    <TableCell sx={{ width: 440 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 1,
                          minWidth: 440,
                        }}
                      >
                        <Box
                          sx={{
                            width: 340,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 1,
                          }}
                        >
                          {confirmDeleteId === team.id ? (
                            <>
                              <Typography variant="caption">
                                Delete this team?
                              </Typography>

                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteTeam(team.id)}
                              >
                                Confirm
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <IconButton onClick={() => setConfirmDeleteId(team.id)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  )
}