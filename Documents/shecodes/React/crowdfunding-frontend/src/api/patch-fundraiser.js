// Patch a fundraiser. data should be a partial object with fields to update.
async function patchFundraiser(fundraiserId, data, token) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

  console.log("PATCH fundraiser:", {
    url,
    fundraiserId,
    data,
    token: token ? "✓ Present" : "✗ Missing",
  });

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  console.log("PATCH response status:", response.status);

  if (!response.ok) {
    const fallbackError = `Error updating fundraiser ${fundraiserId}`;
    try {
      const dataErr = await response.json();
      console.log("PATCH error response:", dataErr);
      const errorMessage =
        dataErr?.detail ||
        dataErr?.error ||
        JSON.stringify(dataErr) ||
        fallbackError;
      throw new Error(errorMessage);
    } catch (parseErr) {
      console.log("Could not parse PATCH error:", parseErr);
      throw new Error(fallbackError);
    }
  }

  const responseData = await response.json();
  console.log("PATCH success response:", responseData);
  return responseData;
}

export default patchFundraiser;
