async function getFundraiser(fundraiserID) {
    const url = `$.{import.meta.env.VITE_API_URL}/fundraisers/${fundraiserID}`
    const response = await fetch(url, {method: "Get"});

    if (!response.ok) {
        const fallbackError = `Error fetching fundraiser with id ${fundraiserId}`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
        }
        return await response.json();
}
export default getFundraiser;
    //error handling done in other file, copy and paste or create function library that you can keep referencing best pracitce
