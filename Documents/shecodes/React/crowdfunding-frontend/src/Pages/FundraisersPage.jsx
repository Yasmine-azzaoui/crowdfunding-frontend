import FundraiserCard from "../components/FundraiserCard.jsx";
import useFundraisers from "../hooks/use-fundraisers.js";
// import "./HomePage.css";

function FundraisersPage() {
  const { fundraisers, isLoading } = useFundraisers();

  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Filter open fundraisers
  const openFundraisers = fundraisers.filter((f) => f.is_open);
  return (
    <section className="fundraisers-section">
      <h1>Open fundraisers</h1>
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
  );
}

export default FundraisersPage;
