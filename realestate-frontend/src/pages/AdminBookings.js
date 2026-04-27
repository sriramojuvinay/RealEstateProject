import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import "./AdminBookings.css";
import api from "../services/api";
import AdminBookingsSkeleton from "../components/Skeletons/AdminBookingsSkeleton";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH BOOKINGS
  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get("/bookings/all"); // ✅ FIXED
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ✅ APPROVE
  const approveBooking = async (id) => {
    try {
      await api.put(`/bookings/approve/${id}`); // ✅ FIXED

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "Approved" } : b
        )
      );

      toast.success("Booking Approved ✅");
    } catch (err) {
      console.error(err);
      toast.error("Approval failed ❌");
    }
  };

  // ✅ REJECT
  const rejectBooking = async (id) => {
    try {
      await api.put(`/bookings/reject/${id}`); // ✅ FIXED

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "Rejected" } : b
        )
      );

      toast.success("Booking Rejected ❌");
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed ❌");
    }
  };

  if (loading) return <AdminBookingsSkeleton />

  return (
    <div className="admin-bookings">
      <h2>📋 Booking Management</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">

              <h3>{b.property?.title || "No Title"}</h3>
              <p>📍 {b.property?.location || "No Location"}</p>
              <p>💰 ₹{b.property?.price || "N/A"}</p>

              <hr />

              <p><b>User:</b> {b.userName || b.userId}</p>
              <p><b>Email:</b> {b.email || "N/A"}</p>

              <p>
                <b>Date:</b>{" "}
                {b.bookingDate
                  ? new Date(b.bookingDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span className={`status ${b.status?.toLowerCase() || "pending"}`}>
                  {b.status || "Pending"}
                </span>
              </p>

              {b.status === "Pending" ? (
                <div className="actions">
                  <button
                    className="approve-btn"
                    onClick={() => approveBooking(b.id)}
                  >
                    ✅ Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rejectBooking(b.id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              ) : (
                <p className="disabled-text">Action completed</p>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;