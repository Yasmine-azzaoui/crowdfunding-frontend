// Get the current user's details using the token stored in localStorage
async function getCurrentUser(token) {
  const url = `${import.meta.env.VITE_API_URL}/users/`;
  // Many Django apps expose a list endpoint; if your API provides a dedicated
  // `current user` endpoint instead, replace the URL.
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) {
    const fallbackError = "Error fetching current user";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  // The example backend returns a list of users; we'll try to find the user
  // that matches the token's user id using the token response stored in localStorage.
  return await response.json();
}

export default getCurrentUser;
