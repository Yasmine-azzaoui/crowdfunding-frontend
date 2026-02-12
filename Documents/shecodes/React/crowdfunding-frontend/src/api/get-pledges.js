// Fetch all pledges to find ones by a specific user
async function getPledges(token) {
  const url = `${import.meta.env.VITE_API_URL}/pledges/`;

  const headers = {
    method: "GET",
    headers: {},
  };

  if (token) {
    headers.headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, headers);

  if (!response.ok) {
    const fallbackError = "Error fetching pledges";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default getPledges;
