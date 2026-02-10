// Fetch a single fundraiser by id.
// This function mirrors the pattern used in `get-fundraisers.js` and throws
// a helpful error when the request fails.
async function getFundraiser(fundraiserID) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserID}`;
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    const fallbackError = `Error fetching fundraiser with id ${fundraiserID}`;
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default getFundraiser;
