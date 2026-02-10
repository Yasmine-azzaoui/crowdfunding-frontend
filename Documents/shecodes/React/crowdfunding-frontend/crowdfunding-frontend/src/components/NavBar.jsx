import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  // token presence indicates an authenticated session. The app also stores
  // a small `user` JSON object in localStorage after login (see LoginForm).
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = (event) => {
    // Clear stored auth info and navigate to home
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/fundraisers/">Fundraisers</Link>
        </li>
        {token ? (
          <>
            <li>Signed in as: {user?.username ?? "user"}</li>
            <li>
              <button onClick={handleLogout}>Log Off</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Log In</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
