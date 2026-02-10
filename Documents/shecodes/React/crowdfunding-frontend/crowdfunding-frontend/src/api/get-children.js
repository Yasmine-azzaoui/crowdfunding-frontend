// Fetch children for a fundraiser
async function getChildren(fundraiserID, token) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserID}/children/`;
  const headers = { method: "GET" };
  if (token) headers.headers = { Authorization: `Token ${token}` };

  const response = await fetch(url, headers);
  if (!response.ok) {
    const fallbackError = `Error fetching children for fundraiser ${fundraiserID}`;
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }
  return await response.json();
}

export default getChildren;
