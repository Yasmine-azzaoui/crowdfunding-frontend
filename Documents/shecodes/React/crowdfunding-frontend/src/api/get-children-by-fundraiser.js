// Fetch all children and filter by fundraiser ID
async function getChildrenByFundraiser(fundraiserID, token) {
  const url = `${import.meta.env.VITE_API_URL}/children/`;

  const headers = {
    method: "GET",
    headers: {},
  };

  if (token) {
    headers.headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, headers);

  if (!response.ok) {
    const fallbackError = "Error fetching children";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  const allChildren = await response.json();
  console.log("All children from API:", allChildren);
  console.log(
    "Looking for children with fundraisers ID =",
    fundraiserID,
    "Type:",
    typeof fundraiserID,
  );

  // Filter children by fundraiser
  // Children have a "fundraisers" field which is a single integer ID
  const fundraiserChildren = Array.isArray(allChildren)
    ? allChildren.filter((child) => {
        const childFundraiserId = child.fundraisers;
        const match =
          childFundraiserId === fundraiserID ||
          childFundraiserId == fundraiserID;
        console.log(
          `Child ${child.id}: fundraisers=${childFundraiserId} (${typeof childFundraiserId}), target=${fundraiserID} (${typeof fundraiserID}), match=${match}`,
        );
        return match;
      })
    : [];

  console.log(
    `Found ${fundraiserChildren.length} children for fundraiser ${fundraiserID}:`,
    fundraiserChildren,
  );
  return fundraiserChildren;
}

export default getChildrenByFundraiser;
