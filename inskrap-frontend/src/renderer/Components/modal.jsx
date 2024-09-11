import React from "react";
import "./modal.css";

// Google voice integration submission modal
function Modal({ isVisible, onClose }) {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
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
        />
        <div className="modal-button-container">
          <button onClick={onClose} className="modal-submit-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
