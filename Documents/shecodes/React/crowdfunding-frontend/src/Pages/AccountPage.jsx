import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import getFundraisers from "../api/get-fundraisers";
import patchFundraiser from "../api/patch-fundraiser";

function AccountPage() {
  const navigateTo = useNavigate();
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const [userFundraisers, setUserFundraisers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        const allFundraisers = await getFundraisers();
        console.log("All fundraisers from API:", allFundraisers);
        console.log("Current user object:", user);
        console.log("Current user ID:", user.id);

        // Try different possible owner field names
        const userCreatedFundraisers = allFundraisers.filter((f) => {
          console.log(
            `Fundraiser ${f.id} owner:`,
            f.owner,
            "Type:",
            typeof f.owner,
            "User ID:",
            user.id,
            "Type:",
            typeof user.id,
          );
          return f.owner === user.id || f.owner == user.id; // Check both === and ==
        });

        console.log("Filtered user fundraisers:", userCreatedFundraisers);
        setUserFundraisers(userCreatedFundraisers);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [user.id]);

  // const fetchAccountData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const allFundraisers = await getFundraisers();
  //     const userCreatedFundraisers = allFundraisers.filter(
  //       (f) => f.owner === user.id,
  //     );
  //     setUserFundraisers(userCreatedFundraisers);
  //     setIsLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setIsLoading(false);
  //   }
  // };

  // fetchAccountData();
  // }, [token, user, navigateTo]);

  const handleStatusToggle = async (fundraiserId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await patchFundraiser(fundraiserId, { is_open: newStatus }, token);
      setUserFundraisers((prev) =>
        prev.map((f) =>
          f.id === fundraiserId ? { ...f, is_open: newStatus } : f,
        ),
      );
      setMessage(`Fundraiser ${newStatus ? "opened" : "closed"}!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (isLoading)
    return (
      <div className="account-page">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="account-page">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <main className="account-page">
      {/* User Header */}
      <div className="account-header">
        <h1>Welcome, {user.first_name || "User"}!</h1>
        <p>Email: {user.email}</p>
        {user.bluecard && (
          <p className="bluecard-label">✓ Verified Bluecard Member</p>
        )}
      </div>

      {/* Message */}
      {message && <div className="message success">{message}</div>}

      {/* My Fundraisers */}
      <section className="fundraisers-section">
        <h2>My Fundraiser{userFundraisers.length !== 1 ? "s" : ""}</h2>

        {userFundraisers.length === 0 ? (
          <p className="empty-state">You've got no fundraisers yet.</p>
        ) : (
          <div className="fundraisers-list-simple">
            {userFundraisers.map((fundraiser) => (
              <div key={fundraiser.id} className="fundraiser-card-simple">
                <div className="card-header-simple">
                  <h3>{fundraiser.title}</h3>
                  <span
                    className={`badge ${fundraiser.is_open ? "open" : "closed"}`}
                  >
                    {fundraiser.is_open ? "Open" : "Closed"}
                  </span>
                </div>

                <p className="card-summary">{fundraiser.summary}</p>

                <div className="card-details">
                  <div className="detail-row">
                    <span className="label">Goal:</span>
                    <span className="value">${fundraiser.goal}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Created:</span>
                    <span className="value">
                      {new Date(fundraiser.date_created).toLocaleDateString()}
                    </span>
                  </div>
                  {fundraiser.pledges && fundraiser.pledges.length > 0 && (
                    <div className="detail-row">
                      <span className="label">Pledges:</span>
                      <span className="value">{fundraiser.pledges.length}</span>
                    </div>
                  )}
                </div>

                <button
                  className={`btn-status ${fundraiser.is_open ? "btn-close" : "btn-open"}`}
                  onClick={() =>
                    handleStatusToggle(fundraiser.id, fundraiser.is_open)
                  }
                >
                  {fundraiser.is_open ? "Close" : "Open"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AccountPage;
