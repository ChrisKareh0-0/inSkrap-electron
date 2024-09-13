import React from "react";
import "./modal.css";
import { useState } from "react";

// Google voice integration submission modal
function Modal({ isVisible, onClose }) {
  const [useCheckbox, setUseCheckbox] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (!isVisible) return null;

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

  const isSubmitEnabled = useCheckbox && inputValue.trim() !== "";

  const handleSubmit = () => {
    // TODO: Backend connection

    // Reset the form after submission
    setUseCheckbox(false);
    setInputValue("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" onClick={handleModalClick}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-header">Create Message</h2>
        <h3 className="modal-subheader">
          This is where you create a message to be broadcasted for all phone
          numbers you discovered in your search.{" "}
          <span>Clicking submit will broadcast the message!</span>
        </h3>
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
        </div>
      </div>
    </div>
  );
}

export default Modal;
