import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RentalDashboard.css";
import { FaTrash } from "react-icons/fa";

// 🔥 MONTH NAMES
const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const RentalDashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRental, setSelectedRental] = useState(null);
  const [payments, setPayments] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });

  // 🔥 FETCH RENTALS
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await api.get("/bookings/rentals");
        setRentals(res.data);
      } catch (err) {
        console.error("Rental error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  // 🔥 NORMALIZE DATA
  const normalizeData = (data) => {
    return data.map((p) => ({
      ...p,
      isPaid: Boolean(p.IsPaid ?? p.isPaid),
    }));
  };

  // 🔥 OPEN PAYMENT MODAL
  const openPaymentModal = async (rental) => {
    try {
      const res = await api.get(`/rentpayment/history/${rental.id}`);

      const fixedData = normalizeData(res.data);

      setPayments(fixedData);
      setSelectedRental(rental);

      calculateSummary(fixedData);
    } catch (err) {
      console.error("Payment fetch error:", err);
    }
  };

  // 🔥 SUMMARY CALCULATION
  const calculateSummary = (data) => {
    const total = data.reduce((sum, p) => sum + p.amount, 0);

    const paid = data
      .filter((p) => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    setSummary({
      total,
      paid,
      pending: total - paid,
    });
  };

  // 🔥 END RENTAL
  const handleEndRental = async (id) => {
    if (!window.confirm("End this rental?")) return;

    try {
      await api.post(`/rental/end/${id}`);

      setRentals((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isActive: false } : r
        )
      );
    } catch {
      alert("Failed to end rental ❌");
    }
  };

  const closeModal = () => {
    setSelectedRental(null);
  };

  const handleDeleteRental = async (id) => {
  if (!window.confirm("Are you sure you want to delete this rental?"))
    return;

  try {
    await api.delete(`/rental/${id}`);

    // ✅ Update UI instantly
    setRentals((prev) => prev.filter((r) => r.id !== id));

  } catch (err) {
    console.error("Delete error:", err);
    alert("Delete failed ❌");
  }
};

  if (loading) return <h2>Loading rentals...</h2>;

  return (
    <div className="rental-dashboard">
      <h2>🏠 Rental Properties Management</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Tenant</th>
              <th>Monthly Rent</th>
              <th>Status</th>
              <th>Total Due</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rentals.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No rentals found
                </td>
              </tr>
            ) : (
              rentals.map((r) => (
                <tr key={r.id}>
                  <td className="property-cell">
                    <img
                      src={
                        r.property?.imageUrls?.[0] ||
                        "https://placehold.co/60"
                      }
                      alt=""
                    />
                    <span>{r.property?.title}</span>
                  </td>

                  <td>{r.tenantName || "N/A"}</td>
                  <td>₹{r.monthlyRent}</td>

                  <td>
                    <span
                      className={
                        r.isActive ? "status active" : "status ended"
                      }
                    >
                      {r.isActive ? "Active" : "Ended"}
                    </span>
                  </td>

                  <td className="due">₹{r.monthlyRent}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openPaymentModal(r)}
                    >
                      View
                    </button>

                    {r.isActive && (
                      <button
                        className="end-btn"
                        onClick={() => handleEndRental(r.id)}
                      >
                        End
                      </button>
                    )}

                   {!r.isActive && (
                    <button
                      className="delete-icon-btn"
                      onClick={() => handleDeleteRental(r.id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {selectedRental && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>💰 Rent Tracker: {selectedRental.tenantName}</h2>

            {/* SUMMARY */}
            <div className="payment-summary">
              <div className="card total">
                <p>Total</p>
                <h3>₹{summary.total}</h3>
              </div>

              <div className="card paid">
                <p>Paid</p>
                <h3>₹{summary.paid}</h3>
              </div>

              <div className="card pending">
                <p>Pending</p>
                <h3>₹{summary.pending}</h3>
              </div>
            </div>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>

                    {/* ✅ FIXED MONTH DISPLAY */}
                    <td>{months[p.month - 1] || "N/A"}</td>

                    <td>
                      <span className={`status ${p.isPaid ? "paid" : "pending"}`}>
                        {p.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td>₹{p.amount}</td>

                    <td>
                      {selectedRental.isActive && !p.isPaid ? (
                        <button
                          onClick={async () => {
                            try {
                              await api.post(`/rentpayment/pay/${p.id}`);

                              const res = await api.get(
                                `/rentpayment/history/${selectedRental.id}`
                              );

                              const updated = normalizeData(res.data);
                              setPayments(updated);
                              calculateSummary(updated);

                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          Mark as Paid
                        </button>
                      ) : p.isPaid ? (
                        <span className="paid-label">✔ Paid</span>
                      ) : (
                        <span className="disabled-label">Not Allowed</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default RentalDashboard;