// Create a new fundraiser
// fundraiserData can be FormData or object
async function postFundraiser(fundraiserData, token) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/`;

  // Determine headers - only set Content-Type if not FormData
  const headers = {
    Authorization: token ? `Token ${token}` : undefined,
  };

  // If it's FormData, don't set Content-Type (browser will set it with boundary)
  if (!(fundraiserData instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body:
      fundraiserData instanceof FormData
        ? fundraiserData
        : JSON.stringify(fundraiserData),
  });

  if (!response.ok) {
    const fallbackError = "Error creating fundraiser";
    try {
      const data = await response.json();
      console.log("Backend error response:", data);
      const errorMessage =
        data?.detail || data?.error || JSON.stringify(data) || fallbackError;
      throw new Error(errorMessage);
    } catch (parseErr) {
      console.log("Could not parse error response:", parseErr);
      throw new Error(fallbackError);
    }
  }

  return await response.json();
}

export default postFundraiser;
