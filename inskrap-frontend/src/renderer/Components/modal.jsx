import React from "react";
import "./modal.css";
import { useState } from "react";
import Switch from "./Switch";

function Modal({ isModalVisible, onClose }) {
  const [useCheckbox, setUseCheckbox] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Toggle button states
  const [email, setEmail] = useState(false);
  const [gvoice, setGVoice] = useState(false);

  const toggleEmailSwitch = () => {
    setEmail(!email);
  };

  const toggleGVoiceSwitch = () => {
    setGVoice(!gvoice);
  };

  const handleBackdropClick = (e) => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (e) => {
    setUseCheckbox(e.target.checked);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const isSubmitEnabled =
    useCheckbox && inputValue.trim() !== "" && (gvoice || email);

  const handleSubmit = () => {
    // TODO: Backend connection

    // Reset the form after submission
    setUseCheckbox(false);
    setEmail(false);
    setGVoice(false);
    setInputValue("");
    onClose();
  };

  return (
    <div
      className={`modal-backdrop ${isModalVisible ? "show" : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`modal-container ${isModalVisible ? "show" : ""}`}
        onClick={handleModalClick}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-header">Create Message</h2>
        <h3 className="modal-subheader">
          This is where you create a message to be broadcasted for all phone
          numbers or emails you discovered in your search. Start by selecting
          your broadcast platforms below.{" "}
          <span>Clicking submit will broadcast the message!</span>
        </h3>

        <div className="broadcast-toggles">
          <div className="grouped-toggle">
            <p
              style={{
                color: email ? "rgb(0, 150, 0)" : "",
              }}
            >
              Email
            </p>
            <Switch toggleSwitch={toggleEmailSwitch} toggleValue={email} />
          </div>
          <div className="grouped-toggle">
            <p
              style={{
                color: gvoice ? "rgb(0, 150, 0)" : "",
              }}
            >
              GVoice
            </p>
            <Switch toggleSwitch={toggleGVoiceSwitch} toggleValue={gvoice} />
          </div>
        </div>

        <input
          type="text"
          placeholder="Enter the message here"
          className="modal-input"
          value={inputValue}
          onChange={handleInputChange}
        />

        <label className="checkbox-container">
          <input
            className="unlock-checkbox"
            type="checkbox"
            checked={useCheckbox}
            onChange={handleCheckboxChange}
          />
          <span className="checkmark"></span>
          <span>Unlock the submission button?</span>
        </label>
        <div className="modal-button-container">
          <div className="element-with-tooltip">
            <button
              onClick={handleSubmit}
              className="themed-button"
              disabled={!isSubmitEnabled}
              style={{
                backgroundColor: isSubmitEnabled ? "" : "gray",
              }}
            >
              Submit
            </button>
            <span className="tooltip-text">
              Submit the message and start the broadcast
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
