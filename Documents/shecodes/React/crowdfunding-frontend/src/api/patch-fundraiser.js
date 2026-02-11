// Patch a fundraiser. data should be a partial object with fields to update.
async function patchFundraiser(fundraiserId, data, token) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const fallbackError = `Error updating fundraiser ${fundraiserId}`;
    const dataErr = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = dataErr?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default patchFundraiser;
