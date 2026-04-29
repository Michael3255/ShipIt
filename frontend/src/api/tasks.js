const BASE_URL = "http://127.0.0.1:8000/api/tasks";

export async function getTask(taskId, accessToken) {
  const response = await fetch(`${BASE_URL}/${taskId}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch task");
  return data;
}

export async function getTasks(objectiveId, accessToken) {
  const response = await fetch(`${BASE_URL}/?objective=${objectiveId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch tasks");
  return data;
}

export async function createTask(objectiveId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...formData, objective: objectiveId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to create task");
  return data;
}

export async function editTask(taskId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/${taskId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to edit task");
  return data;
}

export async function deleteTask(taskId, accessToken) {
  const response = await fetch(`${BASE_URL}/${taskId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete task");
  }
}