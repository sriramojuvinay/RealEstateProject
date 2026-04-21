import React from "react";

const BookingSuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>🎉 Booking Confirmed!</h2>
        <p>Your property has been booked successfully.</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
};

export default BookingSuccessModal;