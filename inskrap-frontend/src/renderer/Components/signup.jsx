import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

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
      return (
        cardName &&
        cardNumber.length >= 12 &&
        expirationDate &&
        (cvv.length === 3 || cvv.length === 4) &&
        address
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

  return (
    <>
      <h1 className="page-title">inSkrap Signup</h1>
      <form className="signup-form">
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
      </form>
      <div>
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
              <span className="tooltip-text">Go back to personal details</span>
            </div>
            <div className="element-with-tooltip">
              <button
                className="themed-button"
                type="submit"
                disabled={!isPaymentInfoValid}
                onClick={() => navigate("/search")}
                style={{ backgroundColor: isPaymentInfoValid ? "" : "gray" }}
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
              disabled={!isPersonalDetailsValid}
              onClick={changeSection}
              style={{ backgroundColor: isPersonalDetailsValid ? "" : "gray" }}
            >
              Next
            </button>
            <span className="tooltip-text">
              The button will be usable when all fields are filled correctly
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default Signup;
