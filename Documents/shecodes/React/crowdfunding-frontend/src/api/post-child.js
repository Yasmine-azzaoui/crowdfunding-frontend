// Create a new child
// childData should be an object like:
// { firstname: 'string', lastname: 'string', DOB: 'YYYY-MM-DD', description: 'string', SpecialHelp: boolean, Specify: 'string or null', imageUrl: 'string or null', fundraisers: id (optional) }
async function postChild(childData, token) {
  const url = `${import.meta.env.VITE_API_URL}/children/`;

  // Send as JSON since backend expects URLField for image
  const childPayload = {
    firstname: childData.firstname,
    lastname: childData.lastname,
    DOB: childData.DOB,
    description: childData.description,
    SpecialHelp: childData.SpecialHelp,
  };

  if (childData.Specify) {
    childPayload.Specify = childData.Specify;
  }

  if (childData.imageUrl) {
    childPayload.image = childData.imageUrl;
  }

  if (childData.fundraisers) {
    childPayload.fundraisers = childData.fundraisers;
  }

  console.log("POST child - URL:", url);
  console.log("POST child - Token:", token ? "✓ Present" : "✗ Missing");
  console.log("POST child - Data being sent:", childPayload);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : undefined,
    },
    body: JSON.stringify(childPayload),
  });

  console.log("  Response Status:", response.status, response.statusText);

  if (!response.ok) {
    const fallbackError = "Error creating child";
    try {
      const data = await response.json();
      console.error("❌ Backend error response (child):", data);
      const errorMessage =
        data?.detail || data?.error || JSON.stringify(data) || fallbackError;
      throw new Error(errorMessage);
    } catch (parseErr) {
      console.error("❌ Could not parse child error response:", parseErr);
      throw new Error(fallbackError);
    }
  }

  const responseData = await response.json();
  console.log("✅ Child created successfully:", responseData);
  return responseData;
}

export default postChild;
