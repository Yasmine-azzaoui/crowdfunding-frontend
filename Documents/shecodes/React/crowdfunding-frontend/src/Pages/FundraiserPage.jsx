import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getFundraiser from "../api/get-fundraiser";
import getChildrenByFundraiser from "../api/get-children-by-fundraiser";
import getUsers from "../api/get-users";
import postPledge from "../api/post-pledge";
import patchFundraiser from "../api/patch-fundraiser";
import ChildCard from "../components/ChildCard.jsx";

function FundraiserPage() {
  // Grab id from URL params
  const { id } = useParams();

  // Local UI state for fundraiser, children and loading/errors
  const [fundraiser, setFundraiser] = useState(null);
  const [children, setChildren] = useState([]);
  const [users, setUsers] = useState([]); // Store all users for mapping supporter IDs to names
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  // Get token and user from localStorage to decide what to show and allow
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    // Fetch fundraiser details, children, and users using async logic.
    setIsLoading(true);

    Promise.all([
      getFundraiser(id),
      getChildrenByFundraiser(id, token).catch((err) => {
        console.error("Error fetching children:", err);
        return []; // Return empty array if children fetch fails
      }),
      getUsers(token).catch((err) => {
        console.error("Error fetching users:", err);
        return []; // Return empty array if users fetch fails
      }),
    ])
      .then(([fundraiserData, childrenData, usersData]) => {
        console.log("Fundraiser data:", fundraiserData);
        console.log("Children data:", childrenData);
        console.log("Users data:", usersData);

        setFundraiser(fundraiserData);
        setChildren(childrenData || []);
        setUsers(usersData || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching fundraiser:", err);
        setError(err);
        setIsLoading(false);
      });
  }, [id, token]);

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>{error.message}</p>;

  // Helper to post a money pledge
  const handlePledgeMoney = async (amount) => {
    try {
      const pledgeData = {
        pledge_type: "money",
        amount: amount,
        hours: null,
        comment: "",
        anonymous: false,
        fundraiser: fundraiser.id,
      };
      await postPledge(pledgeData, token);
      setMessage("Money pledge submitted");
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Helper to post a time pledge (only allowed if user is authenticated and has bluecard)
  const handlePledgeTime = async (hours) => {
    if (!token) {
      setMessage("You must be logged in to pledge time.");
      return;
    }
    if (!user?.bluecard) {
      setMessage("Only users with a verified bluecard can pledge time.");
      return;
    }

    try {
      // The backend Pledge model currently stores `hours` and `comment`.
      // We'll include scheduled date/time information inside the `comment`
      // field so the backend can surface it to the fundraiser owner.
      const scheduleInfo =
        scheduledDate || scheduledTime
          ? `Scheduled: ${scheduledDate} ${scheduledTime}`
          : "";
      const pledgeData = {
        pledge_type: "time",
        amount: null,
        hours: hours,
        comment: scheduleInfo,
        anonymous: false,
        fundraiser: fundraiser.id,
      };
      await postPledge(pledgeData, token);
      setMessage("Time pledge submitted");
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Handler to toggle fundraiser open/closed status
  const handleToggleStatus = async () => {
    try {
      console.log("Toggling fundraiser status...");
      const newStatus = !fundraiser.is_open;
      const updatedFundraiser = await patchFundraiser(
        fundraiser.id,
        { is_open: newStatus },
        token,
      );
      console.log("Status updated:", updatedFundraiser);
      setFundraiser(updatedFundraiser);
      setMessage(
        `Fundraiser ${newStatus ? "reopened" : "closed"} successfully!`,
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error toggling status:", err);
      setMessage(`Error: ${err.message}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Helper functions for progress tracking
  const calculateTotalMoney = () => {
    return (fundraiser?.pledges || [])
      .filter((p) => p.pledge_type === "money")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const calculateTotalHours = () => {
    return (fundraiser?.pledges || [])
      .filter((p) => p.pledge_type === "time")
      .reduce((sum, p) => sum + parseInt(p.hours || 0), 0);
  };

  const calculateTimePledges = () => {
    return (fundraiser?.pledges || []).filter((p) => p.pledge_type === "time")
      .length;
  };

  // Helper function to get supporter name from supporter ID
  const getSupporterName = (supporterId) => {
    const supporter = users.find((u) => u.id === supporterId);
    if (supporter) {
      return supporter.first_name || supporter.username || "Anonymous";
    }
    return "Anonymous";
  };

  return (
    <main className="fundraiser-detail-page">
      <div className="fundraiser-container">
        <div className="fundraiser-header">
          <div className="header-top">
            <h1>{fundraiser.title}</h1>
            {user && fundraiser.owner === user.id && (
              <button
                onClick={handleToggleStatus}
                className={`toggle-status-btn ${fundraiser.is_open ? "close-btn" : "open-btn"}`}
                title={
                  fundraiser.is_open ? "Close fundraiser" : "Reopen fundraiser"
                }
              >
                {fundraiser.is_open ? "Close" : "Reopen"}
              </button>
            )}
          </div>
          <div className="fundraiser-meta">
            <span
              className={`status-badge ${fundraiser.is_open ? "open" : "closed"}`}
            >
              {fundraiser.is_open ? "✓ Accepting Pledges" : "✗ Closed"}
            </span>
            <span className="date">
              Created: {new Date(fundraiser.date_created).toLocaleDateString()}
            </span>
          </div>
        </div>
        {fundraiser.image && (
          <div className="fundraiser-image-wrapper">
            <img
              src={fundraiser.image}
              alt={fundraiser.title}
              className={`fundraiser-hero-image ${
                token && user?.bluecard ? "" : "blurred"
              }`}
              loading="lazy"
            />

            {!(token && user?.bluecard) && (
              <div className="image-lock-overlay">
                🔒 Bluecard Required to View Image
              </div>
            )}
          </div>
        )}

        <div className="fundraiser-description">
          <h2>About this fundraiser</h2>
          <p>{fundraiser.description || "No description provided."}</p>
        </div>

        <div className="fundraiser-description">
          <h2>About this fundraiser</h2>
          <p>{fundraiser.description || "No description provided."}</p>
        </div>

        {/* Progress Section */}
        <section className="progress-section">
          <h2>📊 Progress</h2>
          <div className="progress-grid">
            {/* Money Progress */}
            {fundraiser.goal && (
              <div className="progress-item">
                <h3>💰 Money Raised</h3>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(
                        (calculateTotalMoney() / fundraiser.goal) * 100,
                        100,
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="progress-text">
                  <span className="raised">
                    ${calculateTotalMoney().toFixed(2)}
                  </span>
                  <span className="goal">of ${fundraiser.goal}</span>
                </div>
                <p className="progress-percent">
                  {Math.round((calculateTotalMoney() / fundraiser.goal) * 100)}%
                  funded
                </p>
              </div>
            )}

            {/* Time Progress */}
            {calculateTotalHours() > 0 && (
              <div className="progress-item">
                <h3>⏰ Time Pledged</h3>
                <div className="time-stats">
                  <div className="stat">
                    <span className="stat-value">{calculateTotalHours()}</span>
                    <span className="stat-label">Hours</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{calculateTimePledges()}</span>
                    <span className="stat-label">
                      Pledge{calculateTimePledges() !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Total Pledges */}
            <div className="progress-item">
              <h3>👥 Total Pledges</h3>
              <div className="pledge-count">
                <span className="count">{fundraiser.pledges?.length || 0}</span>
                <span className="label">
                  {(fundraiser.pledges?.length || 0) === 1
                    ? "person supported"
                    : "people supported"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Children Section */}
        <section className="children-section">
          <h2>Children We're Helping 👶</h2>
          {token && user?.bluecard ? (
            <div className="children-list">
              {children.length === 0 ? (
                <p className="no-children">
                  No children attached to this fundraiser yet.
                </p>
              ) : (
                children.map((child) => (
                  <ChildCard
                    key={child.id ?? `${child.firstname}-${child.lastname}`}
                    child={child}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="bluecard-cta">
              <p>
                Child details are private and only visible to verified Bluecard
                members for safety and privacy reasons.
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  margin: "0.5rem 0 0 0",
                }}
              >
                <strong>Login with a verified Bluecard</strong> to see the
                children this fundraiser helps.
              </p>
            </div>
          )}
        </section>

        {/* Pledges Section */}
        <section className="pledges-section">
          <h2>Support This Fundraiser 💝</h2>

          {message && (
            <div
              className={`alert ${message.includes("Error") || message.includes("must be") ? "error" : "success"}`}
            >
              {message}
            </div>
          )}

          <div className="pledge-section money-pledge">
            <h3>💰 Make a Money Pledge</h3>
            <div className="preset-amounts">
              <button
                onClick={() => handlePledgeMoney("25.00")}
                className="preset-btn"
              >
                Pledge $25
              </button>
              <button
                onClick={() => handlePledgeMoney("50.00")}
                className="preset-btn"
              >
                Pledge $50
              </button>
              <button
                onClick={() => handlePledgeMoney("100.00")}
                className="preset-btn"
              >
                Pledge $100
              </button>
            </div>

            <div className="custom-amount">
              <label htmlFor="customAmount">Custom Amount:</label>
              <div className="input-group">
                <span className="currency-symbol">$</span>
                <input
                  id="customAmount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  aria-label="Donation amount in dollars"
                />
              </div>
              <button
                onClick={() => {
                  if (customAmount && parseFloat(customAmount) > 0) {
                    handlePledgeMoney(customAmount);
                    setCustomAmount("");
                  } else {
                    setMessage("Please enter a valid amount");
                  }
                }}
                disabled={!customAmount || parseFloat(customAmount) <= 0}
                className="pledge-btn"
              >
                Pledge ${customAmount || "0"}
              </button>
            </div>
          </div>

          <h3>⏰ Pledge Your Time</h3>
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
            Help by offering your time and skills
          </p>
          <div>
            <label htmlFor="scheduledDate">Preferred Date (optional):</label>
            <input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="scheduledTime">Preferred Time (optional):</label>
            <input
              id="scheduledTime"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="form-input"
            />
          </div>
          <button
            onClick={() => handlePledgeTime(2)}
            disabled={!token || !user?.bluecard}
            className="pledge-btn time-btn"
          >
            Pledge 2 Hours
          </button>
          {!token && <p className="note">🔐 Please log in to pledge time</p>}
          {token && !user?.bluecard && (
            <p className="note">
              🔒 Only verified Bluecard members can pledge time
            </p>
          )}
        </section>

        {/* Recent Pledges */}
        {(fundraiser.pledges ?? []).length > 0 && (
          <section className="recent-pledges">
            <h2>Recent Support 🙏</h2>
            <div className="pledges-list">
              {fundraiser.pledges.map((pledgeData, key) => (
                <div key={key} className="pledge-item">
                  <div className="pledge-type">
                    {pledgeData.amount
                      ? `💰 $${pledgeData.amount}`
                      : `⏱️ ${pledgeData.hours} hours`}
                  </div>
                  <div className="pledge-supporter">
                    from{" "}
                    <strong>{getSupporterName(pledgeData.supporter)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default FundraiserPage;
