import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { getTeam, joinTeam, leaveTeam } from '../api/teams'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

export const TeamDetail = () => {
  const { teamId } = useParams()
  const { authFetch } = useContext(AuthContext)

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function loadTeam() {
      try {
        setLoading(true)
        setError('')

        const data = await getTeam(teamId, authFetch)
        setTeam(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (authFetch) {
      loadTeam()
    }
  }, [teamId, authFetch])

  async function handleJoinTeam() {
    try {
      setError('')
      setSuccessMessage('')

      await joinTeam(teamId, authFetch)

      const updatedTeam = await getTeam(teamId, authFetch)
      setTeam(updatedTeam)

      setSuccessMessage('You joined this team successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLeaveTeam() {
    try {
      setError('')
      setSuccessMessage('')

      await leaveTeam(teamId, authFetch)

      const updatedTeam = await getTeam(teamId, authFetch)
      setTeam(updatedTeam)

      setSuccessMessage('You left this team successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <Container>
        <Typography sx={{ mt: 4 }}>
          Loading team...
        </Typography>
      </Container>
    )
  }

  return (
    <Container>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
        {team?.title}
      </Typography>

      <Button
        variant="contained"
        onClick={handleJoinTeam}
        sx={{ mb: 3, mr: 2 }}
      >
        Join Team
      </Button>

      <Button
        variant="outlined"
        color="error"
        onClick={handleLeaveTeam}
        sx={{ mb: 3 }}
      >
        Leave Team
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Team Members
          </Typography>

          <List>
            {team?.users?.length > 0 ? (
              team.users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user} />
                </ListItem>
              ))
            ) : (
              <Typography>
                No team members found.
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  )
}