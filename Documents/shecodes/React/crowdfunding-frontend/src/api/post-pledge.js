// Post a pledge to a fundraiser. pledgeData should be an object like:
// { pledge_type: 'money'|'time', amount: '25.00', hours: null|2, comment: '', anonymous: false, fundraiser: 1 }
async function postPledge(pledgeData, token) {
  const url = `${import.meta.env.VITE_API_URL}/pledges/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : undefined,
    },
    body: JSON.stringify(pledgeData),
  });

  if (!response.ok) {
    const fallbackError = "Error creating pledge";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default postPledge;
