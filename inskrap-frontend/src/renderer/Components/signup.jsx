import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function Signup({ changeAccountMethod }) {
  const navigate = useNavigate();
  const [section, setSection] = useState("Personal");

  // State for Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for Payment Info
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");

  const changeSection = () => {
    if (section === "Personal") {
      setSection("Payment");
    } else {
      setSection("Personal");
    }
  };

  return (
    <>
      <h1 className="page-title">inSkrap Signup</h1>
      <form className="signup-form">
        {section === "Personal" ? (
          <div className="details-container">
            <h2>Personal Details</h2>
            <div className="signup-container">
              <label>First Name:</label>
              <input
                className="themed-input"
                type="text"
                placeholder="Enter your first name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Last Name:</label>
              <input
                className="themed-input"
                type="text"
                placeholder="Enter your last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Email:</label>
              <input
                className="themed-input"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Password:</label>
              <input
                className="themed-input"
                type="password"
                placeholder="Create a password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Confirm Password:</label>
              <input
                className="themed-input"
                type="password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="details-container">
            <h2>Payment Info</h2>
            <div className="signup-container">
              <label>Cardholder's Name:</label>
              <input
                className="themed-input"
                type="text"
                placeholder="Enter the cardholder's name"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Card Number:</label>
              <input
                className="themed-input"
                type="number"
                placeholder="Enter the card number"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Expiration Date:</label>
              <input
                className="themed-input"
                type="date"
                placeholder="Enter the expiration date"
                required
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>CVV/CVC Code:</label>
              <input
                className="themed-input"
                type="number"
                placeholder="Enter the code"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
            <div className="signup-container">
              <label>Address:</label>
              <input
                className="themed-input"
                type="text"
                placeholder="Enter your full address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        )}
      </form>
      <div>
        <p className="switch-method-text" onClick={changeAccountMethod}>
          Already have an account?
        </p>

        {section === "Payment" ? (
          <div className="button-container">
            <button
              className="themed-button"
              type="button"
              onClick={changeSection}
            >
              Back
            </button>
            <button
              className="themed-button"
              type="submit"
              onClick={() => navigate("/search")}
            >
              Signup
            </button>
          </div>
        ) : (
          <button
            className="themed-button"
            type="button"
            onClick={changeSection}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}

export default Signup;
