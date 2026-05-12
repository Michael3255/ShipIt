const BASE_URL = "http://127.0.0.1:8000/api/users"

export async function getTeamMembers(authFetch) {
  const response = await authFetch(`${BASE_URL}/team-members/`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch team members")
  return data
}