import React, { useContext, useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "../context/AuthContext"

import {
  TextField, FormControl, Box, Stack, Button,
  Typography, Card, CardContent, Alert, Chip, Divider, InputLabel, Select, MenuItem
} from "@mui/material"
import Grid from "@mui/material/Grid"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import CloseIcon from "@mui/icons-material/Close"
import { generateStory } from "../api/aiTools"
import { getObjectives } from "../api/objectives"
import { createTask } from "../api/tasks"

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  blue:      "#1B6FEB",
  blueDark:  "#1358C4",
  blueLight: "#EBF2FF",
  teal:      "#0ABFA3",
  tealLight: "#E0FAF6",
  border:    "#E4EAF2",
  surface:   "#F7F9FC",
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fff",
    "&:hover fieldset":       { borderColor: COLORS.blue },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.blue },
}

const EMPTY_FORM = { project_title: "", objective: "", feature: "" }

export const StoryBuilder = () => {
  const { projectId } = useParams()
  const { authFetch } = useContext(AuthContext)

  const [objectives, setObjectives] = useState([])
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null)
  const [objectivesLoading, setObjectivesLoading] = useState(true)
  const [objectivesError, setObjectivesError] = useState("")
  const [addedTask,setAddedTask] = useState([])
  const [taskCreateError, setTaskCreateError] = useState("")

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  useEffect(() => {
    async function loadObjectives(){
      try{
        setObjectivesLoading(true)
        setObjectivesError("")
        const data = await getObjectives(projectId, authFetch)
        setObjectives(data)
      }catch (err){
        setObjectivesError(err.message)
      }finally {
        setObjectivesLoading(false)
      }
    }
    if (authFetch) loadObjectives()
  }, [projectId, authFetch])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleCancel() {
    setFormData(EMPTY_FORM)
    setError("")
  }

  function handleClearResult() {
    setResult(null)
    setError("")
  }

  async function handleAddSuggestedTask(taskText){
    try {
      if (!selectedObjectiveId){
        setError("Objective does not exist")
        return
      }
      const payload = {
        title:taskText,
        description: `Generated from Task Builder for: ${formData.feature}`,
        status: "To Do",
        due_date:new Date().toISOString().split("T")[0],
        objective: selectedObjectiveId
      }
      const addedTask = await createTask(selectedObjectiveId, payload, authFetch)
      setAddedTask((prev) => [...prev, addedTask])
    }catch(err){
      setTaskCreateError(err.message)
    }
  }
  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setLoading(true)
      setError("")
      setResult(null)
      const data = await generateStory(formData)
      setResult(data)
    } catch (err) {
      setError(err.message || "Failed to generate story")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.project_title !== "" && formData.objective !== "" && formData.feature !== ""

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", px: { xs: 2, sm: 0 }, pt:4 }}>

      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.teal})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: "text.primary", lineHeight: 1.2}}>
            Task Builder
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", pb:3}}>
            Generate completion checks and task suggestions
          </Typography>
        </Box>
      </Stack>

      {/* Form Card */}
      <Card sx={{
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 3,
        boxShadow: "none",
        mb: 3,
      }}>
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
          <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75, textTransform: "uppercase", letterSpacing: 0.6 }}>
                    Project Title
                  </Typography>
                  <TextField
                    fullWidth required
                    placeholder="e.g. ShipIt Task Manager"
                    name="project_title"
                    value={formData.project_title}
                    onChange={handleChange}
                    size="small"
                    sx={inputSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb:0.75}}>
                    Objective
                  </Typography>                  
                  <FormControl fullWidth size="small" sx={inputSx}>
                    <Select
                      displayEmpty
                      value={selectedObjectiveId ?? ""}
                      onChange={(e) =>{
                        const selectedId = e.target.value
                        setSelectedObjectiveId(selectedId)
                        
                        const selectedObjective = objectives.find(o =>o.id === selectedId)

                        setFormData(prev => ({...prev, objective: selectedObjective?.title ?? ""}))
                      }}
                      disabled={objectivesLoading}
                    >
                      <MenuItem value="" disabled>
                      {objectivesLoading ? "Loading..." : "Select an objective"}
                      </MenuItem>
                      {objectives.map((objective) => (<MenuItem key={objective.id} value={objective.id}>{objective.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl> 
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75, textTransform: "uppercase", letterSpacing: 0.6 }}>
                    Feature Description
                  </Typography>
                  <TextField
                    fullWidth required
                    placeholder="Describe the feature you want to build in detail..."
                    name="feature"
                    multiline
                    rows={4}
                    value={formData.feature}
                    onChange={handleChange}
                    sx={{
                      ...inputSx,
                      "& .MuiOutlinedInput-root": {
                        ...inputSx["& .MuiOutlinedInput-root"],
                        alignItems: "flex-start",
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* Actions */}
              <Stack direction="row" spacing={1.5} mt={3} sx={{ pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !isFormValid}
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    bgcolor: COLORS.blue,
                    "&:hover": { bgcolor: COLORS.blueDark },
                    "&:disabled": { opacity: 0.5 },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                    boxShadow: `0 4px 12px rgba(27,111,235,0.25)`,
                  }}
                >
                  {loading ? "Generating..." : "Generate Story"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    borderColor: COLORS.border,
                    color: "text.secondary",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: COLORS.surface, borderColor: COLORS.blue, color: COLORS.blue },
                  }}
                >
                  Clear Form
                </Button>
              </Stack>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}
      {/* Objectives loading error */}
      {objectivesError && (
        <Alert severity="error" onClose={() => setObjectivesError("")} sx={{ mb: 2, borderRadius: 2 }}>{objectivesError}
        </Alert>
      )}

      {/* Result Card */}
      {result && (
        <Card sx={{
          border: `1.5px solid ${COLORS.border}`,
          borderRadius: 3,
          boxShadow: `0 4px 16px rgba(27,111,235,0.08)`,
          overflow: "hidden",
        }}>
          {/* Result Header */}
          <Box sx={{
            background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.teal} 100%)`,
            px: 3, py: 2,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AutoAwesomeIcon sx={{ fontSize: 16, color: "#fff" }} />
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
                Generated Story
              </Typography>
              <Chip
                label={formData.project_title}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, fontSize: 11, height: 20 }}
              />
            </Stack>
            <Button
              size="small"
              startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
              onClick={handleClearResult}
              sx={{
                color: "rgba(255,255,255,0.85)",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 1.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.15)", color: "#fff" },
              }}
            >
              Clear
            </Button>
          </Box>

          <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>

            {/* Story Summary */}
            <Box mb={3}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: COLORS.blue }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: COLORS.blue, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Story Summary
                </Typography>
              </Stack>
              <Box sx={{
                p: 2, borderRadius: 2,
                bgcolor: COLORS.blueLight,
                border: `1px solid rgba(27,111,235,0.15)`,
              }}>
                <Typography sx={{ fontSize: 14, color: "text.primary", lineHeight: 1.7 }}>
                  {result.story_summary}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: COLORS.border, mb: 3 }} />

            {/* Completion Checks */}
            <Box mb={3}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: COLORS.teal }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Completion Checks
                </Typography>
                <Chip
                  label={result.completion_checks.length}
                  size="small"
                  sx={{ bgcolor: COLORS.tealLight, color: COLORS.teal, fontWeight: 700, fontSize: 11, height: 20 }}
                />
              </Stack>
              <Stack spacing={1}>
                {result.completion_checks.map((check, index) => (
                  <Stack key={index} direction="row" alignItems="flex-start" spacing={1.5}
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 16, color: COLORS.teal, mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: "text.primary", lineHeight: 1.5 }}>
                      {check}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Divider sx={{ borderColor: COLORS.border, mb: 3 }} />

            {/* Suggested Tasks */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#8B5CF6" }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Suggested Tasks
                </Typography>
                <Chip
                  label={result.suggested_tasks.length}
                  size="small"
                  sx={{ bgcolor: "#F3F0FF", color: "#8B5CF6", fontWeight: 700, fontSize: 11, height: 20 }}
                />
              </Stack>
              <Stack spacing={1}>
                {result.suggested_tasks.map((task, index) => {
                  const alreadyAdded = addedTask.some(t=> t.title === task)
                  return (
                  <Stack key={index} direction="row" alignItems="flex-start" spacing={1.5}
                  sx={{ p: 1.5, borderRadius: 2, bgcolor: COLORS.surface, border: `1px solid ${COLORS.border}`}}
                  >
                    <TaskAltIcon sx={{ fontSize: 16, color: "#8B5CF6", mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: "text.primary", lineHeight: 1.5 }}>
                      {task}
                    </Typography>
                    {alreadyAdded ? (
                      <Chip label="Added x" size="small" sx={{ bgcolor: COLORS.tealLight, color:COLORS.teal, fontWeight: 700 }} />
                    ): (
                        <Button variant="contained"
                        onClick={() => handleAddSuggestedTask(task)}
                        sx={{
                          bgcolor: COLORS.blue,
                          "&:hover": { bgcolor: COLORS.blueDark },
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                          flexShrink: 0,
                          px: 3, ml:"auto" 
                        }}>
                          + Add Task
                        </Button>
                      
                    )}
                  </Stack>
                  )
                  
                })}
              </Stack>
            </Box>
            {taskCreateError && (
              <Alert severity="error" onClose={() => setTaskCreateError("")} sx={{ mt: 2, borderRadius: 2 }}>
                {taskCreateError}
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
