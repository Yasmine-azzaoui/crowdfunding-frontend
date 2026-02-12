import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import getFundraisers from "../api/get-fundraisers";
import getPledges from "../api/get-pledges";
import patchFundraiser from "../api/patch-fundraiser";

function AccountPage() {
  const navigateTo = useNavigate();
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const [userCreatedFundraisers, setUserCreatedFundraisers] = useState([]);
  const [userSupportedFundraisers, setUserSupportedFundraisers] = useState([]);
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

        // Get all fundraisers
        const allFundraisers = await getFundraisers();
        console.log("All fundraisers from API:", allFundraisers);
        console.log("Current user ID:", user.id);

        // Filter fundraisers created by this user
        const createdFundraisers = allFundraisers.filter(
          (f) => f.owner === user.id || f.owner == user.id,
        );
        console.log("Fundraisers created by user:", createdFundraisers);
        setUserCreatedFundraisers(createdFundraisers);

        // Get pledges to find supported fundraisers
        try {
          const allPledges = await getPledges(token);
          console.log("All pledges:", allPledges);

          // Filter pledges by current user and get unique fundraiser IDs
          const userPledges = Array.isArray(allPledges)
            ? allPledges.filter(
                (p) => p.supporter === user.id || p.supporter == user.id,
              )
            : [];

          console.log("User's pledges:", userPledges);

          // Get unique fundraiser IDs from pledges
          const supportedFundraiserIds = [
            ...new Set(userPledges.map((p) => p.fundraiser)),
          ];
          console.log("Supported fundraiser IDs:", supportedFundraiserIds);

          // Get fundraiser details for supported fundraisers
          const supportedFundraisers = allFundraisers.filter((f) =>
            supportedFundraiserIds.includes(f.id),
          );

          console.log("Supported fundraisers details:", supportedFundraisers);
          setUserSupportedFundraisers(supportedFundraisers);
        } catch (pledgeErr) {
          console.warn("Could not fetch pledges:", pledgeErr);
          setUserSupportedFundraisers([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [user.id, token]);

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
      console.log(`Toggling fundraiser ${fundraiserId} status from ${currentStatus} to ${!currentStatus}`);
      const newStatus = !currentStatus;
      console.log("Calling patchFundraiser with:", { fundraiserId, is_open: newStatus, token: token ? "✓" : "✗" });
      
      await patchFundraiser(fundraiserId, { is_open: newStatus }, token);
      
      console.log("Patch successful, updating local state");
      setUserCreatedFundraisers((prev) =>
        prev.map((f) =>
          f.id === fundraiserId ? { ...f, is_open: newStatus } : f,
        ),
      );
      setMessage(`Fundraiser ${newStatus ? "opened" : "closed"}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error toggling status:", err);
      setMessage(`Error: ${err.message}`);
      setTimeout(() => setMessage(""), 3000);
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

      {/* My Created Fundraisers */}
      <section className="fundraisers-section">
        <h2>
          Fundraiser{userCreatedFundraisers.length !== 1 ? "s" : ""} I Created
        </h2>

        {userCreatedFundraisers.length === 0 ? (
          <p className="empty-state">
            You haven't created any fundraisers yet.
          </p>
        ) : (
          <div className="fundraisers-list-simple">
            {userCreatedFundraisers.map((fundraiser) => (
              <div key={fundraiser.id} className="fundraiser-card-simple">
                <div className="card-header-simple">
                  <h3>{fundraiser.title}</h3>
                  <span
                    className={`badge ${fundraiser.is_open ? "open" : "closed"}`}
                  >
                    {fundraiser.is_open ? "Open" : "Closed"}
                  </span>
                </div>

                <p className="card-summary">
                  {fundraiser.summary || "No summary"}
                </p>

                <div className="card-details">
                  <div className="detail-row">
                    <span className="label">Goal:</span>
                    <span className="value">${fundraiser.goal || "N/A"}</span>
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
                  title={fundraiser.is_open ? "Close this fundraiser to stop receiving pledges" : "Open this fundraiser to accept pledges"}
                >
                  {fundraiser.is_open ? "Close Fundraiser" : "Reopen Fundraiser"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fundraisers I Support */}
      <section className="fundraisers-section">
        <h2>
          Fundraiser{userSupportedFundraisers.length !== 1 ? "s" : ""} I Support
        </h2>

        {userSupportedFundraisers.length === 0 ? (
          <p className="empty-state">
            You haven't supported any fundraisers yet.
          </p>
        ) : (
          <div className="fundraisers-list-simple">
            {userSupportedFundraisers.map((fundraiser) => (
              <div key={fundraiser.id} className="fundraiser-card-simple">
                <div className="card-header-simple">
                  <h3>{fundraiser.title}</h3>
                  <span
                    className={`badge ${fundraiser.is_open ? "open" : "closed"}`}
                  >
                    {fundraiser.is_open ? "Open" : "Closed"}
                  </span>
                </div>

                <p className="card-summary">
                  {fundraiser.summary || "No summary"}
                </p>

                <div className="card-details">
                  <div className="detail-row">
                    <span className="label">Goal:</span>
                    <span className="value">${fundraiser.goal || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Created:</span>
                    <span className="value">
                      {new Date(fundraiser.date_created).toLocaleDateString()}
                    </span>
                  </div>
                  {fundraiser.pledges && fundraiser.pledges.length > 0 && (
                    <div className="detail-row">
                      <span className="label">Total Pledges:</span>
                      <span className="value">{fundraiser.pledges.length}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AccountPage;
