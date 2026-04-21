import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminBookings.css";

const BASE_URL = "http://localhost:5000/api/bookings";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  
  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const approveBooking = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
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

  const rejectBooking = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  if (loading) return <h2>Loading bookings...</h2>;

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