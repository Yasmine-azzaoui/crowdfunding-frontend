import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // token presence indicates an authenticated session. The app also stores
  // a small `user` JSON object in localStorage after login (see LoginForm).
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = (event) => {
    // Clear stored auth info and navigate to home
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/");
  };

  const toggleMobile = () => setMobileOpen((v) => !v);

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="Go to home">
          <span className="logo-text">🏠 Dorfkind</span>
        </Link>

        <button
          className="mobile-toggle"
          aria-controls="primary-navigation"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={toggleMobile}
        >
          <span className="hamburger" aria-hidden="true"></span>
          <span className="hamburger" aria-hidden="true"></span>
          <span className="hamburger" aria-hidden="true"></span>
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav ${mobileOpen ? "open" : ""}`}
          aria-label="Primary"
        >
          <ul>
            <li>
              <Link to="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/fundraisers" onClick={() => setMobileOpen(false)}>
                Fundraisers
              </Link>
            </li>

            {token ? (
              <>
                {user?.bluecard && (
                  <li>
                    <Link
                      to="/create-fundraiser"
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Fundraiser
                    </Link>
                  </li>
                )}

                <li>
                  <Link to="/account" onClick={() => setMobileOpen(false)}>
                    Account
                  </Link>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn-logout">
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-login"
                >
                  Log In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
