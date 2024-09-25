import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css";

function Settings({ isSettingsVisible, onClose, isBlurred, toggleBlur }) {
  const [blurSwitch, setBlurSwitch] = useState(true);
  const navigate = useNavigate();

  const handleBackdropClick = (e) => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const toggleBlurSwitch = () => {
    setBlurSwitch(!blurSwitch);
    toggleBlur();
  };

  return (
    <div
      className={`modal-backdrop ${isSettingsVisible ? "show" : ""}`}
      onClick={handleBackdropClick}
      style={{
        backdropFilter: isBlurred ? "blur(12px)" : "",
      }}
    >
      <div
        className={`modal-container ${isSettingsVisible ? "show" : ""}`}
        onClick={handleModalClick}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-header">Settings Menu</h2>
        <h3 className="modal-subheader">
          You can manage various settings here in this menu, from account
          settings to performance.
        </h3>
        <div className="settings-broadcast-toggles">
          <div className="settings-grouped-toggle">
            <p>Blur Effect</p>
            <div
              className={`settings-switch ${isBlurred ? "on" : "off"}`}
              onClick={toggleBlurSwitch}
            >
              <div className="settings-toggle"></div>
            </div>
          </div>
        </div>
        <button
          className="themed-button"
          type="button"
          style={{ marginTop: "0.5rem" }}
          onClick={() => navigate("/")}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Settings;
