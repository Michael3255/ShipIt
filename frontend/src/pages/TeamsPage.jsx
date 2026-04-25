import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getTeams, createTeam } from '../api/teams'

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

export const TeamsPage = () => {
  const { accessToken } = useContext(AuthContext)

  const [teams, setTeams] = useState([])
  const [title, setTitle] = useState('')
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

  async function handleCreateTeam(event) {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a team name')
      return
    }

    try {
      const newTeam = await createTeam({ title }, accessToken)
      setTeams((prev) => [...prev, newTeam])
      setTitle('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Loading Teams...</p>

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Teams</Typography>

            <Button variant="contained" type="submit" form="create-team-form">
              CREATE TEAM
            </Button>
          </Toolbar>

          <Box
            component="form"
            id="create-team-form"
            onSubmit={handleCreateTeam}
            sx={{ mb: 4 }}
          >
            <TextField
              fullWidth
              placeholder="Enter team title here..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
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
                    <TableCell>{team.title}</TableCell>
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