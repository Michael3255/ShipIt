import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, password_confirm: password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Registration failed")

      localStorage.setItem("access", data.access)
      localStorage.setItem("refresh", data.refresh)
      navigate("/projects")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>Register</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Username" value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button fullWidth type="submit" variant="contained">Register</Button>
          </Box>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Button variant="text" onClick={() => navigate('/login')}>Login</Button>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Register