import React from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function Signup({ changeAccountMethod }) {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="page-title">inSkrap Signup</h1>
      <form className="signup-form">
        <div className="signup-container">
          <label>Email:</label>
          <input
            className="themed-input"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="signup-container">
          <label>Password:</label>
          <input
            className="themed-input"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>
        <p className="switch-method-text" onClick={changeAccountMethod}>
          Already have an account?
        </p>
        <button
          className="themed-button"
          type="submit"
          onClick={() => navigate("/search")}
        >
          Signup
        </button>
      </form>
    </>
  );
}

export default Signup;
