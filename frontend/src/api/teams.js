const BASE_URL = 'http://127.0.0.1:8000/api/team_list_create'

export async function getTeams(accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch teams');
  }

  return data;
}

export async function createTeam(formData, accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to create team');
  }

  return data;
}