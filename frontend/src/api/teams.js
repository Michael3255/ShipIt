const BASE_URL = 'http://127.0.0.1:8000/api/team_list_create'

export async function getTeams(accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch teams')
  }

  return data
}

export async function createTeam(formData, accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to create team')
  }

  return data
}

export async function editTeam(teamId, formData, accessToken) {
  const response = await fetch(`http://127.0.0.1:8000/api/${teamId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to edit team')
  }

  return data
}

export async function deleteTeam(teamId, accessToken) {
  const response = await fetch(`http://127.0.0.1:8000/api/${teamId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || 'Failed to delete team')
  }
}