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

  const handleChange = (event) => {
    const { id, value } = event.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    console.log("we are submitting form");

    event.preventDefault();

    if (credentials.username && credentials.password) {
      // Call API to exchange credentials for token
      postLogin(credentials.username, credentials.password).then(
        async (response) => {
          console.log(response.token);
          window.localStorage.setItem("token", response.token);

          // Optionally fetch user list and try to find the currently logged in user.
          // The backend example returns a list at /users/; we store the first user
          // that matches the email returned by the token response if available.
          try {
            const users = await getCurrentUser(response.token);
            // try to match by email
            const current =
              users.find((u) => u.email === response.email) || users[0];
            window.localStorage.setItem("user", JSON.stringify(current));
          } catch (err) {
            // If fetching user fails it's non-fatal for the login flow.
            console.warn("Could not fetch user info:", err.message);
          }

          navigateTo("/");
        },
      );
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <button type="submit" onClick={handleSubmit}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;
