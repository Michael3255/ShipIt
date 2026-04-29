const BASE_URL = "http://127.0.0.1:8000/api/objectives";

export async function getObjectives(projectId, accessToken) {
  const response = await fetch(`${BASE_URL}/?project=${projectId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch objectives");
  return data;
}

export async function createObjective(projectId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...formData, project: projectId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to create objective");
  return data;
}

export async function editObjective(objectiveId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/${objectiveId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to edit objective");
  return data;
}

export async function deleteObjective(objectiveId, accessToken) {
  const response = await fetch(`${BASE_URL}/${objectiveId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete objective");
  }
}