const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/teams`;

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

export async function getTeam(teamId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${teamId}/`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to load team')
  }

  return data
}

export async function joinTeam(teamId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${teamId}/join/`, {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to join team')
  }

  return data
}

export async function leaveTeam(teamId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${teamId}/leave/`, {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to leave team')
  }

  return data
}