import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getFundraiser from "../api/get-fundraiser";
import getChildrenByFundraiser from "../api/get-children-by-fundraiser";
import postPledge from "../api/post-pledge";
import ChildCard from "../components/ChildCard.jsx";

function FundraiserPage() {
  // Grab id from URL params
  const { id } = useParams();

  // Local UI state for fundraiser, children and loading/errors
  const [fundraiser, setFundraiser] = useState(null);
  const [children, setChildren] = useState([]);
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
    // Fetch fundraiser details and children using async logic.
    setIsLoading(true);

    Promise.all([
      getFundraiser(id),
      getChildrenByFundraiser(id, token).catch((err) => {
        console.error("Error fetching children:", err);
        return []; // Return empty array if children fetch fails
      }),
    ])
      .then(([fundraiserData, childrenData]) => {
        console.log("Fundraiser data:", fundraiserData);
        console.log("Children data:", childrenData);

        setFundraiser(fundraiserData);
        setChildren(childrenData || []);
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

  return (
    <main className="fundraiser-detail-page">
      <div className="fundraiser-container">
        <div className="fundraiser-header">
          <h1>{fundraiser.title}</h1>
          <div className="fundraiser-meta">
            <span className={`status-badge ${fundraiser.is_open ? "open" : "closed"}`}>
              {fundraiser.is_open ? "✓ Accepting Pledges" : "✗ Closed"}
            </span>
            <span className="date">
              Created: {new Date(fundraiser.date_created).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="fundraiser-description">
          <h2>About this fundraiser</h2>
          <p>{fundraiser.description || "No description provided."}</p>
        </div>

        {/* Children Section */}
        <section className="children-section">
          <h2>Children We're Helping 👶</h2>
          {token && user?.bluecard ? (
            <div className="children-list">
              {children.length === 0 ? (
                <p className="no-children">No children attached to this fundraiser yet.</p>
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
                Child details are private and only visible to verified Bluecard members for safety and privacy reasons.
              </p>
              <p style={{fontSize: '0.9rem', color: '#6b7280', margin: '0.5rem 0 0 0'}}>
                <strong>Login with a verified Bluecard</strong> to see the children this fundraiser helps.
              </p>
            </div>
          )}
        </section>

        {/* Pledges Section */}
        <section className="pledges-section">
          <h2>Support This Fundraiser 💝</h2>
          
          {message && (
            <div className={`alert ${message.includes("Error") || message.includes("must be") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <div className="pledge-section money-pledge">
            <h3>💰 Make a Money Pledge</h3>
            <div className="preset-amounts">
              <button onClick={() => handlePledgeMoney("25.00")} className="preset-btn">
                Pledge $25
              </button>
              <button onClick={() => handlePledgeMoney("50.00")} className="preset-btn">
                Pledge $50
              </button>
              <button onClick={() => handlePledgeMoney("100.00")} className="preset-btn">
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
          <p style={{color: '#6b7280', marginBottom: '1rem'}}>Help by offering your time and skills</p>
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
                    {pledgeData.amount ? `💰 $${pledgeData.amount}` : `⏱️ ${pledgeData.hours} hours`}
                  </div>
                  <div className="pledge-supporter">
                    from <strong>{pledgeData.supporter}</strong>
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
