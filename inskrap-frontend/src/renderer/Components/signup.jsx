// Signup.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";
import { toast } from "sonner";

// Reusable input field component
const InputField = ({ label, type, placeholder, value, onChange, tooltip }) => (
  <div className="signup-container">
    <label>{label}</label>
    <div className="element-with-tooltip">
      <input
        className="themed-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {tooltip && <span className="tooltip-text">{tooltip}</span>}
    </div>
  </div>
);

function Signup({ changeAccountMethod }) {
  const navigate = useNavigate();
  const [section, setSection] = useState("Personal");
  const [fadeClass, setFadeClass] = useState("fade fade-in");
  const animationLength = 250;

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    address: "",
    country: "",
  });

  // Form validity states
  const [isPersonalDetailsValid, setIsPersonalDetailsValid] = useState(false);
  const [isPaymentInfoValid, setIsPaymentInfoValid] = useState(false);

  // Submission states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const changeSection = () => {
    setFadeClass("fade fade-out");
    setTimeout(() => {
      setSection((prevSection) =>
        prevSection === "Personal" ? "Payment" : "Personal"
      );
      setFadeClass("fade fade-in");
    }, animationLength);
  };

  // Generic validation function
  const validateFields = (fields, type) => {
    if (type === "personal") {
      const { firstName, lastName, email, password, confirmPassword } = fields;
      const isEmailValid = email.includes("@") && email.includes(".");
      const isPasswordValid =
        password.length >= 8 && password === confirmPassword;
      return firstName && lastName && email && isEmailValid && isPasswordValid;
    } else if (type === "payment") {
      const { cardName, cardNumber, expirationDate, cvv, address } = fields;
      const isCardNumberValid = /^\d{12,16}$/.test(cardNumber);
      const isCvvValid = /^\d{3,4}$/.test(cvv);
      return (
        cardName && isCardNumberValid && expirationDate && isCvvValid && address
      );
    }
    return false;
  };

  // Combined validation logic for both personal details and payment info
  useEffect(() => {
    setIsPersonalDetailsValid(validateFields(personalDetails, "personal"));
    setIsPaymentInfoValid(validateFields(paymentInfo, "payment"));
  }, [personalDetails, paymentInfo]);

  // Handle input changes for personal and payment sections
  const handlePersonalChange = (field) => (e) => {
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      [field]: e.target.value,
    }));
  };

  const handlePaymentChange = (field) => (e) => {
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [field]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      first_name: personalDetails.firstName,
      last_name: personalDetails.lastName,
      email: personalDetails.email,
      password: personalDetails.password,
      // Include payment info if needed by the backend
      payment_info: {
        card_name: paymentInfo.cardName,
        card_number: paymentInfo.cardNumber,
        expiration_date: paymentInfo.expirationDate,
        cvv: paymentInfo.cvv,
        address: paymentInfo.address,
        country: paymentInfo.country,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        payload
      );
      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/search");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">inSkrap Signup</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className={fadeClass}>
          {section === "Personal" ? (
            <div className="personal-details-container">
              <h2>Personal Details</h2>
              <InputField
                label="First Name:"
                type="text"
                placeholder="Enter your first name"
                value={personalDetails.firstName}
                onChange={handlePersonalChange("firstName")}
                tooltip="Your first name as it appears on official documents"
              />
              <InputField
                label="Last Name:"
                type="text"
                placeholder="Enter your last name"
                value={personalDetails.lastName}
                onChange={handlePersonalChange("lastName")}
                tooltip="Your last name as it appears on official documents"
              />
              <InputField
                label="Email:"
                type="email"
                placeholder="Enter your email"
                value={personalDetails.email}
                onChange={handlePersonalChange("email")}
                tooltip="An email such as inskrap@gmail.com"
              />
              <InputField
                label="Password:"
                type="password"
                placeholder="Create a password"
                value={personalDetails.password}
                onChange={handlePersonalChange("password")}
                tooltip="A password with a minimum of 8 characters"
              />
              <InputField
                label="Confirm Password:"
                type="password"
                placeholder="Confirm your password"
                value={personalDetails.confirmPassword}
                onChange={handlePersonalChange("confirmPassword")}
                tooltip="Rewrite the password for confirmation"
              />
            </div>
          ) : (
            <div className="payment-details-container">
              <h2>Payment Info</h2>
              <InputField
                label="Name on card:"
                type="text"
                placeholder="Enter the card name"
                value={paymentInfo.cardName}
                onChange={handlePaymentChange("cardName")}
                tooltip="Name on your card, usually card owner's name"
              />
              <InputField
                label="Card Number:"
                type="text"
                placeholder="Enter the card number"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange("cardNumber")}
                tooltip="Card number, usually 14-16 digits"
              />
              <InputField
                label="CVV/CVC Code:"
                type="text"
                placeholder="Enter the code"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange("cvv")}
                tooltip="3 or 4-digit security code found on your card"
              />
              <InputField
                label="Expiration Date:"
                type="date"
                placeholder="Enter the expiration date"
                value={paymentInfo.expirationDate}
                onChange={handlePaymentChange("expirationDate")}
                tooltip="Expiration date of the card"
              />
              <InputField
                label="Billing Address:"
                type="text"
                placeholder="Enter your full address"
                value={paymentInfo.address}
                onChange={handlePaymentChange("address")}
                tooltip="The address linked to your card for verification of purchases"
              />
              <InputField
                label="Country:"
                type="text"
                placeholder="Enter your country"
                value={paymentInfo.country}
                onChange={handlePaymentChange("country")}
                tooltip="The country where your billing address is located"
              />
            </div>
          )}
        </div>

        {/* Display error message if any */}
        {error && <p className="error-message">{error}</p>}
        {/* Display success message if any */}
        {success && <p className="success-message">{success}</p>}

        <div className="centered-container">
          <p className="switch-method-text" onClick={changeAccountMethod}>
            Already have an account?
          </p>

          {section === "Payment" ? (
            <div className="button-container">
              <div className="element-with-tooltip">
                <button
                  className="themed-button"
                  type="button"
                  onClick={changeSection}
                >
                  Back
                </button>
                <span className="tooltip-text">
                  Go back to personal details
                </span>
              </div>
              <div className="element-with-tooltip">
                <button
                  className="themed-button"
                  type="submit"
                  disabled={!isPaymentInfoValid || loading}
                  style={{
                    backgroundColor:
                      isPaymentInfoValid && !loading ? "" : "gray",
                    cursor:
                      isPaymentInfoValid && !loading
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  Signup
                </button>
                <span className="tooltip-text">
                  The button will be usable when all fields are filled correctly
                </span>
              </div>
            </div>
          ) : (
            <div className="element-with-tooltip">
              <button
                className="themed-button"
                type="button"
                disabled={!isPersonalDetailsValid || loading}
                onClick={changeSection}
                style={{
                  backgroundColor:
                    isPersonalDetailsValid && !loading ? "" : "gray",
                  cursor:
                    isPersonalDetailsValid && !loading
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Next
              </button>
              <span className="tooltip-text">
                The button will be usable when all fields are filled correctly
              </span>
            </div>
          )}
        </div>
      </form>
      {loading ? <div className="loading-bar"></div> : null}
    </>
  );
}

export default Signup;
