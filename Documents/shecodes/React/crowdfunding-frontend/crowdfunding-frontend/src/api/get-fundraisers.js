async function getFundraisers() {
    // First we create the URL for the request by using the Vite Enviroment
    const url = `${import.meta.env.VITE_API_URL}/fundraisers`;
    
    // Next we call the fetch function and pass in the url and the method. The method is set to `GET` because we are fetching data. Fetch returns a "promise".
    // If the promse "resolves" (i.e., if the back end responds) we will get the data we need in the `response` variable. If the back end fails to respond then we'll get an error.
    const response = await fetch(url, {method: "GET"});

    // We can use the `ok` property on `response` to check if the request was succesfull.
    // If the request was not successful then we will throw an error..
    if (!response.ok) {
        const fallbackError = "Error fetching fundraisers";
    // Here we use the `await` keyword to signal to Javascript that it shouldn't run this code until `resonse` gets turned into JSON
    const data = await response.json().catch(() => {
    // If the response is not JSON then we will throw a generic error. 'catch will trigger if we try to tunr `response` into JSON and fail
        throw new Error(fallbackError);    
    });
    // If the error response *is* JSON, then we will include the info from that JSON in the error we throw. 
    // Usually, the server will send the error message in the `detail` property.
    // You may have not configured the back end to use the `detail` property. If that is the case then you can change the code below to use a different property, e.g.: `message`
    
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
    }
    //... on the other hand, if the request was succesfful then we will return the data from the response.
    // Turning the response to JSON takes thime so we need to use the await keyword again.
    return await response.json();
}


export default getFundraisers;


    //what about race condition
    //async functions always return a promise.
    //await can only be used inside an async function.
    //await will wait for the promise to resolve and then return the value.
    //If the promise "rejects" then the await will throw an error.