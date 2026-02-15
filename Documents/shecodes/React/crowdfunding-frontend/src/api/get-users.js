// Fetch all users to get supporter names
async function getUsers(token) {
  const url = `${import.meta.env.VITE_API_URL}/users/`;

  const headers = {
    method: "GET",
    headers: {},
  };

  if (token) {
    headers.headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, headers);

  if (!response.ok) {
    const fallbackError = "Error fetching users";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default getUsers;
