import React from "react";
import "./exportmodal.css";

// Export menu modal
function ExportModal({ isVisible, onClose, exportToPDF, exportToExcel }) {
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
        <h2 className="modal-header">Export Results</h2>
        <h3 className="modal-subheader">
          This is where you can export the results table to either a PDF file or
          an Excel file!
        </h3>
        <div className="export-buttons-container">
          <button onClick={() => exportToPDF()}>Export to PDF</button>
          <button onClick={() => exportToExcel()}>Export to Excel</button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
