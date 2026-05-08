import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

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

        const response = await fetch(`http://127.0.0.1:8000/api/teams/${teamId}/`, {
          headers: {
            Authorization: `Bearer ${authFetch}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load team')
        }

        const data = await response.json()
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

      const response = await fetch(`http://127.0.0.1:8000/api/teams/${teamId}/join/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authFetch}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to join team')
      }

      const updatedTeamResponse = await fetch(`http://127.0.0.1:8000/api/teams/${teamId}/`, {
        headers: {
          Authorization: `Bearer ${authFetch}`,
        },
      })

      if (updatedTeamResponse.ok) {
        const updatedTeam = await updatedTeamResponse.json()
        setTeam(updatedTeam)
      }

      setSuccessMessage('You joined this team successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLeaveTeam() {
    try {
        setError('')
        setSuccessMessage('')

        const response = await fetch(`http://127.0.0.1:8000/api/teams/${teamId}/leave/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authFetch}`,
        },
        })

        if (!response.ok) {
        throw new Error('Failed to leave team')
        }

        const updatedTeamResponse = await fetch(`http://127.0.0.1:8000/api/teams/${teamId}/`, {
        headers: {
            Authorization: `Bearer ${authFetch}`,
        },
        })

        if (updatedTeamResponse.ok) {
        const updatedTeam = await updatedTeamResponse.json()
        setTeam(updatedTeam)
        }

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