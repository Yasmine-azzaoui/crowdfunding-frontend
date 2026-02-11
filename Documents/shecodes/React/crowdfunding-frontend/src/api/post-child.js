// Create a new child
// childData should be an object like:
// { firstname: 'string', lastname: 'string', DOB: 'YYYY-MM-DD', description: 'string', SpecialHelp: boolean, Specify: 'string or null', image: File or null, fundraisers: id (optional) }
async function postChild(childData, token) {
  const url = `${import.meta.env.VITE_API_URL}/children/`;

  // Use FormData for file uploads
  const formData = new FormData();
  formData.append("firstname", childData.firstname);
  formData.append("lastname", childData.lastname);
  formData.append("DOB", childData.DOB);
  formData.append("description", childData.description);
  formData.append("SpecialHelp", childData.SpecialHelp);
  if (childData.Specify) {
    formData.append("Specify", childData.Specify);
  }
  if (childData.image) {
    formData.append("image", childData.image);
  }
  // Add fundraiser ID if provided - try both as single value and as array
  if (childData.fundraisers) {
    // Try sending it - the backend might expect it as an integer or as an array
    formData.append("fundraisers", childData.fundraisers);
  }

  console.log("POST child - URL:", url);
  console.log("POST child - Token:", token ? "✓ Present" : "✗ Missing");
  console.log("POST child - FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}: ${value}`);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token ? `Token ${token}` : undefined,
    },
    body: formData,
  });

  if (!response.ok) {
    const fallbackError = "Error creating child";
    try {
      const data = await response.json();
      console.log("Backend error response (child):", data);
      const errorMessage =
        data?.detail || data?.error || JSON.stringify(data) || fallbackError;
      throw new Error(errorMessage);
    } catch (parseErr) {
      console.log("Could not parse child error response:", parseErr);
      throw new Error(fallbackError);
    }
  }

  return await response.json();
}

export default postChild;
