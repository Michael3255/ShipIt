const BASE_URL = "http://127.0.0.1:8000/api/objectives";

export async function getObjectives(projectId, authFetch) {
  const response = await authFetch(`${BASE_URL}/?project=${projectId}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch objectives")
  return data
}

export async function createObjective(projectId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/`, {
    method: "POST",
    body: JSON.stringify({ ...formData, project: projectId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to create objective")
  return data
}

export async function editObjective(objectiveId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/${objectiveId}/`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to edit objective")
  return data
}

export async function deleteObjective(objectiveId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${objectiveId}/`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Failed to delete objective")
  }
}