const BASE_URL = "http://127.0.0.1:8000/api/comments";

export async function getComments(taskId, authFetch) {
  const response = await authFetch(`${BASE_URL}/?task=${taskId}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to fetch comments")
  return data
}

export async function createComment(taskId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/`, {
    method: "POST",
    body: JSON.stringify({ ...formData, task: taskId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to create comment")
  return data
}

export async function editComment(commentId, formData, authFetch) {
  const response = await authFetch(`${BASE_URL}/${commentId}/`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Failed to edit comment")
  return data
}

export async function deleteComment(commentId, authFetch) {
  const response = await authFetch(`${BASE_URL}/${commentId}/`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.detail || "Failed to delete comment")
  }
}