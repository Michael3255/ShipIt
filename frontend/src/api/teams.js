const BASE_URL = "http://127.0.0.1:8000/api/teams";

// getTeams uses accessToken because it's also called from register page
// where the user may not be logged in yet

// for unauthenticated use (register page)
export async function getTeams() {
  const response = await fetch(`${BASE_URL}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch teams")
  return data
}

// for authenticated use (dashboard, teams page)
export async function getTeamsAuth(authFetch) {
  const response = await authFetch(`${BASE_URL}/`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch teams")
  return data
}
export async function createTeam(formData) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to create team")
  return data
}

export async function editTeam(teamId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/${teamId}/`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to edit team")
  return data
}

export async function deleteTeam(teamId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${teamId}/`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Failed to delete team")
  }
}