const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`

export async function getTeamMembers(authFetch) {
  const response = await authFetch(`${BASE_URL}/team-members/`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch team members")
  return data
}