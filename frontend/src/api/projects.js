const BASE_URL = "http://127.0.0.1:8000/api/projects";

export async function getProjects(accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch projects");
  }
  return data;
}

export async function getProject(projectId, accessToken) {
  const response = await fetch(`${BASE_URL}/${projectId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch project");
  }
  return data;
}

export async function createProject(formData, accessToken) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create project");
  }
  return data;
}

export async function editProject(projectId, formData, accessToken) {
  const response = await fetch(`${BASE_URL}/${projectId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to edit project.");
  return data;
}

export async function deleteProject(projectId, accessToken) {
  const response = await fetch(`${BASE_URL}/${projectId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete project");
  }
}
