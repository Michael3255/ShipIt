import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"
import { getProject } from "../api/projects"
import { createObjective, getObjectives } from "../api/objectives"
import PageContainer from "../components/PageContainer"
import {
  Alert, Card, CardContent, Typography, Box, Button,
  LinearProgress, Chip, Stack, FormControl, TextField,
  Select, MenuItem, FormGroup, Grid, Skeleton, Divider
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import TrackChangesIcon from "@mui/icons-material/TrackChanges"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  blue:        "#1B6FEB",
  blueDark:    "#1358C4",
  blueLight:   "#EBF2FF",
  blueMid:     "#C7DCFF",
  teal:        "#0ABFA3",
  tealDark:    "#088F79",
  tealLight:   "#E0FAF6",
  surface:     "#F7F9FC",
  card:        "#FFFFFF",
  border:      "#E4EAF2",
  textPrimary: "#0D1B2A",
  textMuted:   "#5C6E82",
  textLight:   "#98A8B8",
}

const STATUS_META = {
  "To Do":       { color: COLORS.textMuted,  bg: "#F0F2F5", label: "To Do"       },
  "In Progress": { color: COLORS.blue,       bg: COLORS.blueLight, label: "In Progress" },
  "Done":        { color: COLORS.tealDark,   bg: COLORS.tealLight, label: "Done"        },
}

// ─── Sub-components ───────────────────────────────────────────────

function ProjectHeader({ project }) {
  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.teal} 100%)`,
      borderRadius: 3,
      p: { xs: 3, sm: 4 },
      mb: 4,
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* decorative circle */}
      <Box sx={{
        position: "absolute", right: -40, top: -40,
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        pointerEvents: "none",
      }} />
      <Stack direction="row" alignitems="center" spacing={1.5} mb={1}>
        <RocketLaunchIcon sx={{ fontSize: 20, opacity: 0.85 }} />
        <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, opacity: 0.85, textTransform: "uppercase" }}>
          Project
        </Typography>
      </Stack>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
        {project.title}
      </Typography>
      {project.description && (
        <Typography sx={{ opacity: 0.85, fontSize: 15, maxWidth: 560 }}>
          {project.description}
        </Typography>
      )}
      <Stack direction="row" spacing={3} mt={2.5}>
        <Box>
          <Typography sx={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Owner</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{project.owner || "—"}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Team</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{project.team || "—"}</Typography>
        </Box>
      </Stack>
    </Box>
  )
}

function ObjectiveCard({ objective, projectId, navigate }) {
  const progress = objective.tasks_total > 0
    ? Math.round((objective.tasks_done / objective.tasks_total) * 100)
    : 0

  const meta = STATUS_META[objective.status] || STATUS_META["To Do"]
  const isComplete = progress === 100

  return (
    <Card
      onClick={() => navigate(`/projects/${projectId}/board?objective=${objective.id}`)}
      sx={{
        mb: 2,
        cursor: "pointer",
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 3,
        boxShadow: "none",
        transition: "all 0.18s ease",
        "&:hover": {
          borderColor: COLORS.blue,
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px rgba(27,111,235,0.12)`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" justifycontent="space-between" alignitems="flex-start" mb={1.5}>
          <Stack direction="row" alignitems="center" spacing={1}>
            <TrackChangesIcon sx={{ fontSize: 18, color: COLORS.blue }} />
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: COLORS.textPrimary }}>
              {objective.title}
            </Typography>
          </Stack>
          <Chip
            label={meta.label}
            size="small"
            sx={{
              bgcolor: meta.bg,
              color: meta.color,
              fontWeight: 600,
              fontSize: 11,
              height: 22,
              border: "none",
            }}
          />
        </Stack>

        {/* Progress bar */}
        <Box mb={1}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: COLORS.border,
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                background: isComplete
                  ? `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.tealDark})`
                  : `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.teal})`,
              },
            }}
          />
        </Box>

        <Stack direction="row" justifycontent="space-between" alignitems="center">
          <Typography sx={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500 }}>
            {objective.tasks_done} / {objective.tasks_total} tasks
            {isComplete && (
              <Box component="span" sx={{ ml: 1, color: COLORS.tealDark, fontWeight: 700 }}>
                ✓ Complete
              </Box>
            )}
          </Typography>
          <Stack direction="row" alignitems="center" spacing={0.5}
            sx={{ color: COLORS.blue, fontSize: 12, fontWeight: 600 }}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/projects/${projectId}/board?objective=${objective.id}`)
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.blue }}>View tasks</Typography>
            <KeyboardArrowRightIcon sx={{ fontSize: 16, color: COLORS.blue }} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

function ObjectiveForm({ formData, handleChange, handleSubmit, onCancel }) {
  const isValid = formData.title !== "" && formData.due_date !== ""

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        border: `1.5px dashed ${COLORS.blue}`,
        bgcolor: COLORS.blueLight,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLORS.blue, mb: 2 }}>
        New Objective
      </Typography>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth required
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              size="small"
              sx={inputSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <Select
                name="status"
                value={formData.status || "To Do"}
                onChange={handleChange}
                sx={inputSx}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={inputSx}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={1.5} mt={2.5}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid}
            sx={{
              bgcolor: COLORS.blue,
              "&:hover": { bgcolor: COLORS.blueDark },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            Create Objective
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderColor: COLORS.blue,
              color: COLORS.blue,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: COLORS.blueLight },
            }}
          >
            Cancel
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  )
}

function ObjectiveSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ mb: 2, p: 2.5, borderRadius: 3, border: `1.5px solid ${COLORS.border}` }}>
          <Stack direction="row" justifycontent="space-between" mb={1.5}>
            <Skeleton variant="text" width={160} height={20} />
            <Skeleton variant="rounded" width={70} height={22} />
          </Stack>
          <Skeleton variant="rounded" height={6} sx={{ borderRadius: 3, mb: 1 }} />
          <Skeleton variant="text" width={100} height={16} />
        </Box>
      ))}
    </>
  )
}

// ─── Shared input style ───────────────────────────────────────────
const inputSx = {
  bgcolor: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset": { borderColor: COLORS.blue },
    "&.Mui-focused fieldset": { borderColor: COLORS.blue },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.blue },
}

// ─── Main Component ───────────────────────────────────────────────
export const ProjectDetails = () => {
  const { projectId } = useParams()
  const { accessToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [objectives, setObjectives] = useState([])
  const [objectivesLoading, setObjectivesLoading] = useState(true)
  const [objectivesError, setObjectivesError] = useState("")
  const [formData, setFormData] = useState({ title: "", description: "", status: "To Do", due_date: "" })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true)
        setError("")
        const data = await getProject(projectId, accessToken)
        setProject(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) loadProject()
  }, [projectId, accessToken])

  useEffect(() => {
    async function loadObjectives() {
      try {
        setObjectivesLoading(true)
        setObjectivesError("")
        const data = await getObjectives(projectId, accessToken)
        setObjectives(data)
      } catch (err) {
        setObjectivesError(err.message)
      } finally {
        setObjectivesLoading(false)
      }
    }
    if (accessToken) loadObjectives()
  }, [projectId, accessToken])

  function resetForm() {
    setObjectivesError("")
    setFormData({ title: "", description: "", status: "To Do", due_date: "" })
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const savedObjective = await createObjective(projectId, formData, accessToken)
      setObjectives((prev) => [...prev, savedObjective])
      resetForm()
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return (
    <PageContainer title="Project Details">
      <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3, mb: 4 }} />
      <ObjectiveSkeleton />
    </PageContainer>
  )

  if (error) return (
    <PageContainer title="Project Details">
      <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
    </PageContainer>
  )

  const doneCount = objectives.filter(o => o.status === "Done").length
  const totalCount = objectives.length

  return (
    <PageContainer 
      breadcrumbs={[{ title: "Projects", path: "/projects" }, { title: project?.title || "Project" }]}
    >
      {project && <ProjectHeader project={project} />}

      {/* Objectives Section */}
      <Box>
        <Stack direction="row" justifycontent="space-between" alignitems="center" mb={2}>
          <Stack direction="row" alignitems="center" spacing={1.5}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: COLORS.textPrimary }}>
              Focus Areas
            </Typography>
            {totalCount > 0 && (
              <Chip
                label={`${doneCount}/${totalCount} done`}
                size="small"
                sx={{
                  bgcolor: doneCount === totalCount ? COLORS.tealLight : COLORS.blueLight,
                  color: doneCount === totalCount ? COLORS.tealDark : COLORS.blue,
                  fontWeight: 700,
                  fontSize: 11,
                  height: 22,
                }}
              />
            )}
          </Stack>
          {!showForm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{
                bgcolor: COLORS.blue,
                "&:hover": { bgcolor: COLORS.blueDark },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: `0 4px 12px rgba(27,111,235,0.25)`,
              }}
            >
              Add Objective
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 3, borderColor: COLORS.border }} />

        {objectivesLoading ? (
          <ObjectiveSkeleton />
        ) : (
          <>
            {showForm && (
              <ObjectiveForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); resetForm() }}
              />
            )}

            {objectivesError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{objectivesError}</Alert>
            )}

            {objectives.length === 0 && !showForm ? (
              <Box sx={{
                textAlign: "center", py: 6,
                border: `1.5px dashed ${COLORS.border}`,
                borderRadius: 3,
                bgcolor: COLORS.surface,
              }}>
                <TrackChangesIcon sx={{ fontSize: 40, color: COLORS.textLight, mb: 1.5 }} />
                <Typography sx={{ fontWeight: 700, color: COLORS.textMuted, mb: 0.5 }}>
                  No objectives yet
                </Typography>
                <Typography sx={{ fontSize: 13, color: COLORS.textLight, mb: 2 }}>
                  Break this project into focus areas to track progress
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                  sx={{
                    bgcolor: COLORS.blue,
                    "&:hover": { bgcolor: COLORS.blueDark },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Add First Objective
                </Button>
              </Box>
            ) : (
              objectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  projectId={projectId}
                  navigate={navigate}
                />
              ))
            )}
          </>
        )}
      </Box>
    </PageContainer>
  )
}
