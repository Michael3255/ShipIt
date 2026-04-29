const BASE_URL = "http://127.0.0.1:8000/api/comments";

export async function getComments(taskId, accessToken) {
  const response = await fetch(`${BASE_URL}/?task=${taskId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch comments");
  return data;
}

export async function createComment(taskId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...formData, task: taskId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to create comment");
  return data;
}

export async function editComment(commentId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/${commentId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to edit comment");
  return data;
}

export async function deleteComment(commentId, accessToken) {
  const response = await fetch(`${BASE_URL}/${commentId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete comment");
  }
}