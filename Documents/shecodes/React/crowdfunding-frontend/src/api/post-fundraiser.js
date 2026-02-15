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

  console.log("🔵 POST Fundraiser Debug Info:");
  console.log("  URL:", url);
  console.log("  Token Present:", !!token);
  console.log("  Is FormData:", fundraiserData instanceof FormData);

  // Log FormData contents if applicable
  if (fundraiserData instanceof FormData) {
    console.log("  FormData entries:");
    for (let [key, value] of fundraiserData.entries()) {
      if (value instanceof File) {
        console.log(
          `    ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`,
        );
      } else {
        console.log(`    ${key}: ${value}`);
      }
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body:
      fundraiserData instanceof FormData
        ? fundraiserData
        : JSON.stringify(fundraiserData),
  });

  console.log("  Response Status:", response.status, response.statusText);

  if (!response.ok) {
    const fallbackError = "Error creating fundraiser";
    try {
      const data = await response.json();
      console.error("❌ Backend error response:", data);
      const errorMessage =
        data?.detail || data?.error || JSON.stringify(data) || fallbackError;
      throw new Error(errorMessage);
    } catch (parseErr) {
      console.error("❌ Could not parse error response:", parseErr);
      throw new Error(fallbackError);
    }
  }

  const responseData = await response.json();
  console.log("✅ Fundraiser created successfully:", responseData);
  return responseData;
}

export default postFundraiser;
