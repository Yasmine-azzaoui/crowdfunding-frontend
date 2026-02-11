// Get children belonging to the current user
async function getUserChildren(token) {
  const url = `${import.meta.env.VITE_API_URL}/children/`;
  const response = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Token ${token}` } : {},
  });

  if (!response.ok) {
    const fallbackError = "Error fetching user's children";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default getUserChildren;
