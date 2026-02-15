import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple signup form that posts to the /users/ endpoint.
// NOTE: your backend must accept the fields used here (username, email, password, bluecard, first_name, last_name).
function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    bluecard: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");
    try {
      const url = `${import.meta.env.VITE_API_URL}/users/`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Error creating account");
      }
      setMessage("Account created. Please log in.");
      // navigate to login page so the user can authenticate
      navigate("/login");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create an account</h3>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" value={form.username} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="first_name">First name</label>
        <input
          id="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last name</label>
        <input id="last_name" value={form.last_name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="bluecard">Verified bluecard?</label>
        <input
          id="bluecard"
          type="checkbox"
          checked={form.bluecard}
          onChange={handleChange}
        />
      </div>
      <button className="btn-login" type="submit">
        Create account
      </button>
      <div>{message}</div>
    </form>
  );
}

export default SignupForm;
