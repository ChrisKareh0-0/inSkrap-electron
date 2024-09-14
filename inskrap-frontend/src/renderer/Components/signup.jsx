import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

// Reusable input field component
const InputField = ({ label, type, placeholder, value, onChange }) => (
  <div className="signup-container">
    <label>{label}</label>
    <input
      className="themed-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
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
  });

  // Form validity states
  const [isPersonalDetailsValid, setIsPersonalDetailsValid] = useState(false);
  const [isPaymentInfoValid, setIsPaymentInfoValid] = useState(false);

  const changeSection = () => {
    setFadeClass("fade fade-out"); // Start fade-out
    setTimeout(() => {
      setSection((prevSection) =>
        prevSection === "Personal" ? "Payment" : "Personal"
      );
      setFadeClass("fade fade-in"); // Start fade-in
    }, animationLength); // Duration should match the CSS transition
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
        cardNumber.length >= 8 &&
        expirationDate &&
        cvv.length === 3 &&
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
              />
              <InputField
                label="Last Name:"
                type="text"
                placeholder="Enter your last name"
                value={personalDetails.lastName}
                onChange={handlePersonalChange("lastName")}
              />
              <InputField
                label="Email:"
                type="email"
                placeholder="Enter your email"
                value={personalDetails.email}
                onChange={handlePersonalChange("email")}
              />
              <InputField
                label="Password:"
                type="password"
                placeholder="Create a password"
                value={personalDetails.password}
                onChange={handlePersonalChange("password")}
              />
              <InputField
                label="Confirm Password:"
                type="password"
                placeholder="Confirm your password"
                value={personalDetails.confirmPassword}
                onChange={handlePersonalChange("confirmPassword")}
              />
            </div>
          ) : (
            <div className="payment-details-container">
              <h2>Payment Info</h2>
              <InputField
                label="Cardholder's Name:"
                type="text"
                placeholder="Enter the cardholder's name"
                value={paymentInfo.cardName}
                onChange={handlePaymentChange("cardName")}
              />
              <InputField
                label="Card Number:"
                type="number"
                placeholder="Enter the card number"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange("cardNumber")}
              />
              <InputField
                label="Expiration Date:"
                type="date"
                placeholder="Enter the expiration date"
                value={paymentInfo.expirationDate}
                onChange={handlePaymentChange("expirationDate")}
              />
              <InputField
                label="CVV/CVC Code:"
                type="number"
                placeholder="Enter the code"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange("cvv")}
              />
              <InputField
                label="Address:"
                type="text"
                placeholder="Enter your full address"
                value={paymentInfo.address}
                onChange={handlePaymentChange("address")}
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
              disabled={!isPaymentInfoValid}
              onClick={() => navigate("/search")}
              style={{ backgroundColor: isPaymentInfoValid ? "" : "gray" }}
            >
              Signup
            </button>
          </div>
        ) : (
          <button
            className="themed-button"
            type="button"
            disabled={!isPersonalDetailsValid}
            onClick={changeSection}
            style={{ backgroundColor: isPersonalDetailsValid ? "" : "gray" }}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}

export default Signup;
