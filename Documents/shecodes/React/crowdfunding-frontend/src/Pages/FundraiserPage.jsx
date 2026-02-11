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
    <div>
      <h2>{fundraiser.title}</h2>
      <h3>Created at: {fundraiser.date_created}</h3>
      <h3>{`Status: ${fundraiser.is_open}`}</h3>

      <h3>Children attached to this fundraiser</h3>
      {token && user?.bluecard ? (
        <section className="children-list">
          {children.length === 0 ? (
            <p>No children attached yet.</p>
          ) : (
            children.map((child) => (
              <ChildCard
                key={child.id ?? `${child.firstname}-${child.lastname}`}
                child={child}
              />
            ))
          )}
        </section>
      ) : (
        <div className="bluecard-cta">
          <p>
            Children details are hidden. Only verified bluecard holders can view
            this information for privacy and safety.
          </p>
          <div className="bluecard-mock">
            <div className="bluecard-sample">Bluecard</div>
            <p className="muted">
              Mock-up: Be verified to display children details.
            </p>
          </div>
        </div>
      )}

      <h3>Pledges:</h3>
      <ul>
        {(fundraiser.pledges ?? []).map((pledgeData, key) => {
          return (
            <li key={key}>
              {pledgeData.amount ?? `${pledgeData.hours} hours`} from{" "}
              {pledgeData.supporter}
            </li>
          );
        })}
      </ul>

      <div>
        <h4>Make a pledge</h4>
        <div className="pledge-section money-pledge">
          <h5>Money Pledge</h5>
          <div className="preset-amounts">
            <button onClick={() => handlePledgeMoney("25.00")}>
              Pledge $25
            </button>
            <button onClick={() => handlePledgeMoney("50.00")}>
              Pledge $50
            </button>
            <button onClick={() => handlePledgeMoney("100.00")}>
              Pledge $100
            </button>
          </div>

          <div className="custom-amount">
            <label htmlFor="customAmount">Donation Amount:</label>
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
            >
              Pledge ${customAmount || "0"}
            </button>
          </div>
        </div>

        <div className="pledge-section time-pledge">
          {/* The time pledge button is disabled for anonymous or non-bluecard users */}
          <h5>Time Pledge</h5>
          <div>
            <label htmlFor="scheduledDate">
              Preferred date for time donation
            </label>
            <input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="scheduledTime">Preferred time</label>
            <input
              id="scheduledTime"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
          <button
            onClick={() => handlePledgeTime(2)}
            disabled={!token || !user?.bluecard}
          >
            Pledge 2 hours
          </button>
          {!token && <p className="note">Please log in to pledge time</p>}
          {token && !user?.bluecard && (
            <p className="note">
              Only verified bluecard members can pledge time
            </p>
          )}
        </div>
        <div>{message}</div>
      </div>
    </div>
  );
}

export default FundraiserPage;
