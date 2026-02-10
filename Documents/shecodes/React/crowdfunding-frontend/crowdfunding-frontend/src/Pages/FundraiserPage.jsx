import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getFundraiser from "../api/get-fundraiser";
import getChildren from "../api/get-children";
import postPledge from "../api/post-pledge";

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

  // Get token and user from localStorage to decide what to show and allow
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    // Fetch fundraiser details and children in parallel.
    setIsLoading(true);

    Promise.all([getFundraiser(id), getChildren(id, token).catch(() => [])])
      .then(([fundraiserData, childrenData]) => {
        setFundraiser(fundraiserData);
        // children endpoint might return a single object or array depending on API,
        // but example shows a single child object. Normalize to array.
        const normalizedChildren = Array.isArray(childrenData)
          ? childrenData
          : childrenData
            ? [childrenData]
            : [];
        setChildren(normalizedChildren);
        setIsLoading(false);
      })
      .catch((err) => {
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
      {/*
                Visibility rule:
                - If not logged in, or logged in user doesn't have bluecard, do not show children.
                - If logged in user has bluecard, show children details.
            */}
      {token && user?.bluecard ? (
        <ul>
          {children.map((child, key) => (
            <li key={key}>
              {child.firstname} {child.lastname} ({child.DOB}) -{" "}
              {child.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Children details are hidden. Log in with a verified bluecard to view.
        </p>
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
        <div>
          <button onClick={() => handlePledgeMoney("25.00")}>Pledge $25</button>
        </div>
        <div>
          {/* The time pledge button is disabled for anonymous or non-bluecard users */}
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
        </div>
        <div>{message}</div>
      </div>
    </div>
  );
}

export default FundraiserPage;
