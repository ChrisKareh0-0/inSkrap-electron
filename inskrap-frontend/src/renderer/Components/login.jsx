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
          <div className="element-with-tooltip">
            <input
              className="themed-input"
              type="email"
              placeholder="Enter your email"
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
              required
            />
            <span className="tooltip-text">Enter a valid password</span>
          </div>
        </div>
        <p className="switch-method-text" onClick={changeAccountMethod}>
          Don't have an account?
        </p>
        <div className="element-with-tooltip">
          <button
            className="themed-button"
            type="submit"
            onClick={() => navigate("/search")}
          >
            Login
          </button>
          <span className="tooltip-text">Login to inSkrap</span>
        </div>
      </form>
    </>
  );
}

export default Login;
