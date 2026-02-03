import FundraiserCard from "../assets/components/FundraiserCard.jsx"
import useFundraisers from "../hooks/use-fundraisers.js";
// import "./HomePage.css";

function HomePage() {
    const {fundraisers} = useFundraisers();
    return(
        <div>
        {fundraisers.map((fundraiserData, key) => {
        return <FundraiserCard key={key}>{fundraiserData.title}</FundraiserCard>;
        })}
        </div>
        );

}

export default HomePage;