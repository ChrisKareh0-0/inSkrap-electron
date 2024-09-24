import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { toast } from "sonner";

function Login({ changeAccountMethod }) {
  const navigate = useNavigate();

  // State variables for form inputs and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error state
    setLoading(true); // Set loading state

    try {
      // Send POST request to backend
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Assuming the backend returns { access_token: "..." }
      const { access_token } = response.data;

      // Store the token in localStorage (you can choose a different storage method)
      localStorage.setItem("token", access_token);

      // Optionally, set axios default headers for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Navigate to the desired page
      navigate("/search");
    } catch (err) {
      // Handle errors (e.g., invalid credentials)
      if (err.response && err.response.data && err.response.data.message) {
        setTimeout(() => {
          setError(err.response.data.message);
          toast.error(err.response.data.message);
        }, 3000);
      } else {
        setTimeout(() => {
          setError("An error occurred. Please try again.");
          toast.error("Failed to login try again");
        }, 3000);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <>
      <h1 className="page-title">inSkrap Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-container">
          <label>Email:</label>
          <div className="element-with-tooltip">
            <input
              className="themed-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="tooltip-text">Enter a valid email</span>
          </div>
        </div>
        <div className="login-container">
          <label>Password:</label>
          <div className="element-with-tooltip">
            <input
              className="themed-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="tooltip-text">Enter a valid password</span>
          </div>
        </div>

        <p className="switch-method-text" onClick={changeAccountMethod}>
          Don't have an account?
        </p>

        <button
          className="themed-button"
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: !loading ? "" : "gray",
            cursor: !loading ? "pointer" : "not-allowed",
          }}
        >
          Login
        </button>
      </form>
      {loading ? <div className="loading-bar"></div> : null}
    </>
  );
}

export default Login;
