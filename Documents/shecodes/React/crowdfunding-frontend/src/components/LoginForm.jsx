import { useState } from "react";
import postLogin from "../api/post-login";
import getCurrentUser from "../api/get-current-user";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigateTo = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setError(""); // Clear error when user starts typing

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    if (!credentials.username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (!credentials.password) {
      setError("Please enter a password");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Attempting login...");
      const response = await postLogin(
        credentials.username,
        credentials.password,
      );
      console.log("Login successful, token:", response.token);
      window.localStorage.setItem("token", response.token);

      // Fetch user info
      try {
        const users = await getCurrentUser(response.token);
        const current =
          users.find((u) => u.email === response.email) || users[0];
        window.localStorage.setItem("user", JSON.stringify(current));
      } catch (err) {
        console.warn("Could not fetch user info:", err.message);
      }

      navigateTo("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert error">{error}</div>}

      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          value={credentials.username}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      <button className="btn-login" type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
