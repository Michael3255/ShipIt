import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getTeams, createTeam } from "../api/teams"

import { Container, Card, CardContent, TextField, Button, Typography, Alert, Box, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'


function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Create new team 
  const [teamMode, setTeamMode] = useState("select")
  const [newTeamTitle, setNewTeamTitle] = useState("")

  // Select a Team
  const [teams, setTeams] = useState([])
  const [team, setTeam] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  //Handle Password Confirmation 
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  //Submit User Registration
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if(password !== confirmPassword){
      setError("Passwords do not match")
      return
    }

    try {

      let selectedTeamId = team

      if (teamMode === "select") {
        if (!selectedTeamId){
          setError("Please select a team")
          return
        }
      }

      if (teamMode === "create") {
        if (!newTeamTitle.trim()){
          setError("Please enter a team name")
          return
        }
        const newTeam = await createTeam({ title: newTeamTitle.trim()})
        selectedTeamId = newTeam.id
      }

      

      const res = await fetch("http://localhost:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, password_confirm: confirmPassword, team: selectedTeamId, }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Registration failed")

      localStorage.setItem("access", data.access)
      localStorage.setItem("refresh", data.refresh)
      navigate("/login")
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    async function loadTeams(){
      try{
        setLoading(true)
        setError('')

        const data = await getTeams()
        setTeams(data)
      }catch{
        setError("Unable to load teams")
      } finally {
        setLoading(false)
      }
    }
    loadTeams()

  }, [])

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
            <TextField fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordsMismatch}
            helperText={passwordsMismatch ? "Passwords do not match" : ""} sx={{ mb: 2 }} required
            />

            {/* Select Create or Join Team at registration */}
            <RadioGroup
                row
                value={teamMode}
                onChange={(e) => {
                  setTeamMode(e.target.value)
                  setTeam("")
                  setNewTeamTitle("")
                }} sx={{ mb:2 }}
              >
                <FormControlLabel value="select" control={<Radio />} label="Join a Team" />
                <FormControlLabel value="create" control={<Radio />} label="Create a Team" />
              </RadioGroup>
              
              {teamMode === "select" ? (
                <FormControl fullWidth sx={{ mb:3 }} required >
                  <InputLabel>Select Team</InputLabel>
                  <Select label="Select Team" value={team} onChange={(e) => setTeam(e.target.value)} disabled={loading}>
                    {teams.map((teamOption) =>(
                    <MenuItem key={teamOption.id} value={teamOption.id}>{teamOption.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField fullWidth label="New Team Name" value={newTeamTitle}
                  onChange={(e) => setNewTeamTitle(e.target.value)}
                  sx={{ mb: 3 }} required
                />
              )}
            <Button fullWidth type="submit" variant="contained"
            disabled={loading || passwordsMismatch}
            >Register</Button>
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