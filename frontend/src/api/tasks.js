const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/tasks`;

export async function getTask(taskId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${taskId}/`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch task")
  return data
}

export async function getTasks(filters = {}, authFetch) {
  const params = new URLSearchParams(filters)
  const response = await authFetch(`${BASE_URL}/?${params}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch tasks")
  return data
}

export async function createTask(objectiveId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/`, {
    method: "POST",
    body: JSON.stringify({ ...formData, objective: objectiveId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to create task")
  return data
}

export async function editTask(taskId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/${taskId}/`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to edit task")
  return data
}

export async function deleteTask(taskId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${taskId}/`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Failed to delete task")
  }
}