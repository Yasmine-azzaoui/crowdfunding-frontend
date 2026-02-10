import FundraiserCard from "../components/FundraiserCard.jsx";
import useFundraisers from "../hooks/use-fundraisers.js";
// import "./HomePage.css";

function FundraisersPage() {
  const { fundraisers, isLoading } = useFundraisers();
  console.log(fundraisers);

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      {fundraisers.map((fundraiserData, key) => {
        return (
          <FundraiserCard
            key={key}
            fundraiserData={fundraiserData}
          ></FundraiserCard>
        );
      })}
    </div>
  );
}

export default FundraisersPage;
