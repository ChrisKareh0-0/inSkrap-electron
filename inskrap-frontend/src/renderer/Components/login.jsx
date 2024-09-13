import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ changeAccountMethod }) {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="page-title">inSkrap Login</h1>
      <form className="login-form">
        <div className="login-container">
          <label>Email:</label>
          <input
            className="themed-input"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="login-container">
          <label>Password:</label>
          <input
            className="themed-input"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <p className="switch-method-text" onClick={changeAccountMethod}>
          Don't have an account?
        </p>
        <button
          className="themed-button"
          type="submit"
          onClick={() => navigate("/search")}
        >
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
