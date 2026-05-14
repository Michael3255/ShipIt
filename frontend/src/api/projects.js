const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/board/projects`

export async function getProjects(authFetch) {
  const response = await authFetch(`${BASE_URL}/`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch projects")
  return data
}

export async function createProject(formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/`, {
    method: "POST",
    body: JSON.stringify(formData),
  })
  
  const contentType = response.headers.get("content-type")
  const data = contentType && contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    if (typeof data === 'object') {
      // extract the specific field error if it exists
      const message = data.title?.[0] || data.detail || "Failed to create project"
      throw new Error(message)
    }
    throw new Error("Failed to create project: Does the project already exist?")
  }
  return data
}

export async function editProject(projectId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/${projectId}/`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to edit project")
  return data
}

export async function getProject(projectId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${projectId}/`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch project")
  return data
}

export async function deleteProject(projectId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${projectId}/`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Failed to delete project")
  }
}