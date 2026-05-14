/* accept form data
POST to /api/ai/story-builder/
return JSON response
throw error if response is not ok */
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/ai/story-builder/`;
export async function generateStory(formData) {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch story");
  return data;
}
