// DetailsDialog.js
import React from "react";

function formatTimestamp(seconds) {
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString(); // Adjust the formatting as needed
}

function DetailsDialog({ isOpen, onClose, data }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Details</h2>
        <div>
          <strong>Original Price:</strong> {data.originalPrice}
        </div>
        <div>
          <strong>Current Price:</strong> {data.currentPrice}
        </div>
        <div>
          <strong>Rent Price:</strong> {data.rentPrice}
        </div>
        <div>
          <strong>Approved On:</strong> {formatTimestamp(data.approvedON.seconds)}
        </div>
        <div>
          <strong>Rent Requested On:</strong> {formatTimestamp(data.rentRequestedOn.seconds)}
        </div>
        <div>
          <strong>Date1 On:</strong> {formatTimestamp(data.Date1.seconds)}
        </div>
        <div>
          <strong>Date2 On:</strong> {formatTimestamp(data.Date2.seconds)}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default DetailsDialog;
