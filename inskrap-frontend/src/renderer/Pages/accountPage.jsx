import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/accountPage.css";
import Signup from "../Components/signup";
import Login from "../Components/login";

function AccountPage() {
  const navigate = useNavigate();
  const [accountMethod, setAccountMethod] = useState("Signup");
  const [fadeClass, setFadeClass] = useState("fade fade-in");
  const animationLength = 250;

  const changeAccountMethod = () => {
    setFadeClass("fade fade-out");
    setTimeout(() => {
      setAccountMethod((prevMethod) =>
        prevMethod === "Signup" ? "Login" : "Signup"
      );
      setFadeClass("fade fade-in");
    }, animationLength);
  };

  return (
    <>
      <div className="account-page">
        {/* Back Button */}
        <button className="button" onClick={() => navigate("/")}>
          <div className="button-box">
            <span className="button-elem">
              <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
              </svg>
            </span>
            <span className="button-elem">
              <svg viewBox="0 0 46 40">
                <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
              </svg>
            </span>
          </div>
        </button>

        <div className={fadeClass}>
          {accountMethod === "Signup" ? (
            <Signup changeAccountMethod={changeAccountMethod} />
          ) : (
            <Login changeAccountMethod={changeAccountMethod} />
          )}
        </div>
      </div>
    </>
  );
}

export default AccountPage;
