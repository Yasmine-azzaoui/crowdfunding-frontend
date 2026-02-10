import { useState, useEffect } from "react";
import getFundraisers from "../api/get-fundraisers";

export default function useFundraisers() {

    const [fundraisers, setFundraisers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        // try {
        //     const allFundraisers = getFundraisers()
        //     setFundraisers(allFundraisers)
        // } catch {

        // } finally {

        // }
        getFundraisers().then((fundraisers) => {
            setFundraisers(fundraisers);
            setIsLoading(false);
        });

    }, []);
    return {fundraisers, isLoading, error};
    // pass this function empty to run fundraiser api and then get it and set loading to false
}