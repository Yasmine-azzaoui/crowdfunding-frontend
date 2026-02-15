import { Link, useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Oops! Page not found</h2>

          <p className="not-found-message">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track!
          </p>

          <div className="not-found-illustration">
            <span className="illustration-emoji">🏘️</span>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-large">
              Return to Home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-large"
            >
              Go Back
            </button>
          </div>

          <div className="not-found-suggestions">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">🏠 Home</Link>
              </li>
              <li>
                <Link to="/account">👤 My Account</Link>
              </li>
              <li>
                <Link to="/login">🔐 Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
