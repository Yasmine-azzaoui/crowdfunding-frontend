import FundraiserCard from "../components/FundraiserCard.jsx";
import useFundraisers from "../hooks/use-fundraisers.js";
import { Link } from "react-router-dom";

function HomePage() {
  const { fundraisers, isLoading } = useFundraisers();

  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Filter open fundraisers
  const openFundraisers = fundraisers.filter((f) => f.is_open);

  return (
    <div className="home-page">
      <section className="hero-section">
        {token && user ? (
          <div className="welcome-greeting">
            <h1>Hey {user.first_name || user.username}, welcome home!</h1>
            <p className="tagline">
              Your Dorfkind community is here to support you.
            </p>
            {user?.bluecard && (
              <Link
                to="/create-fundraiser"
                className="btn btn-primary btn-large"
              >
                + Create a Fundraiser
              </Link>
            )}
          </div>
        ) : (
          <div className="welcome-section">
            <h1>Welcome to Dorfkind</h1>
            <p>
              Dorfkind is a community-driven platform that helps families
              connect for childcare support. People create fundraisers to
              request help — either monetary or time-based. Time pledges require
              a verified bluecard.
            </p>
            <p>
              If you'd like to participate, please{" "}
              <Link to="/login">log in</Link> or create an account. Once logged
              in, you can view fundraiser details and pledge support.
            </p>
          </div>
        )}
      </section>

      <section className="fundraisers-section">
        <h2>Open fundraisers</h2>
        {isLoading ? (
          <p>loading...</p>
        ) : openFundraisers.length === 0 ? (
          <p>No open fundraisers at the moment.</p>
        ) : (
          <div className="fundraisers-grid">
            {openFundraisers.map((fundraiserData, key) => (
              <FundraiserCard key={key} fundraiserData={fundraiserData} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
