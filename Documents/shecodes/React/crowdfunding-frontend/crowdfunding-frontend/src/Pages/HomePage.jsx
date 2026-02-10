import FundraiserCard from "../components/FundraiserCard.jsx";
import useFundraisers from "../hooks/use-fundraisers.js";

function HomePage() {
  const { fundraisers, isLoading } = useFundraisers();

  // Educational mockup at top of the home page
  return (
    <div>
      <section>
        <h1>Welcome to Dorfkind</h1>
        <p>
          Dorfkind is a community-driven platform that helps families connect
          for childcare support. People create fundraisers to request help —
          either monetary or time-based. Time pledges require a verified
          bluecard.
        </p>
        <p>
          If you'd like to participate, please use the navigation bar to log in
          or create an account. Once logged in, you can view fundraiser details
          and pledge support.
        </p>
      </section>

      <hr />

      <section>
        <h2>Open fundraisers</h2>
        {isLoading ? (
          <p>loading...</p>
        ) : (
          <div>
            {fundraisers.map((fundraiserData, key) => (
              <FundraiserCard key={key} fundraiserData={fundraiserData} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
