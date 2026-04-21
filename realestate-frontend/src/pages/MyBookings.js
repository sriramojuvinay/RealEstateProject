import React, { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../services/api";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setLoading(false);
          return;
        }

        const res = await getUserBookings(userId);

        
        const bookingData = res || [];

       
        const filtered = bookingData.filter(
          (b) => b.status !== "Rejected"
        );

        setBookings(Array.isArray(filtered) ? filtered : []);

      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id, status) => {
    if (status === "Approved") {
      alert("Approved booking cannot be cancelled ❌");
      return;
    }

    if (!window.confirm("Cancel booking?")) return;

    try {
      await cancelBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Cancel failed ❌");
    }
  };

  const nextImage = (id, images) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % images.length,
    }));
  };

  const prevImage = (id, images) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]:
        (prev[id] || 0) === 0
          ? images.length - 1
          : (prev[id] || 0) - 1,
    }));
  };

  if (loading) return <h2>Loading bookings...</h2>;

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Bookings</h2>

      {!Array.isArray(bookings) || bookings.length === 0 ? (
        <p className="no-bookings">No bookings found ❌</p>
      ) : (
        bookings.map((b) => {
          const images = b.property?.imageUrls || [];
          const currentIndex = imageIndexes[b.id] || 0;

          const currentImage =
            images.length > 0
              ? images[currentIndex]
              : "https://placehold.co/400x250?text=No+Image";

          return (
            <div className="booking-card" key={b.id}>

              
              <div className="booking-image-container">
                <img
                  src={currentImage}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x250?text=No+Image";
                  }}
                  alt=""
                />

                {images.length > 1 && (
                  <>
                    <button
                      className="prev-btn"
                      onClick={() => prevImage(b.id, images)}
                    >
                      ◀
                    </button>

                    <button
                      className="next-btn"
                      onClick={() => nextImage(b.id, images)}
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>

             
              <div className="booking-info">
                <h3>{b.property?.title}</h3>
                <p>📍 {b.property?.location}</p>
                <p className="price">₹{b.property?.price}</p>

                <p className="date">
                  📅 {new Date(b.bookingDate).toLocaleDateString()}
                </p>

                {/* STATUS */}
                <p className={`status ${b.status?.toLowerCase()}`}>
                  <b>Status:</b> {b.status}
                </p>

                {b.status === "Pending" && (
                  <p className="pending">⏳ Waiting for approval</p>
                )}

                {b.status === "Approved" && (
                  <p className="approved">✅ Booking Confirmed</p>
                )}
              </div>

             
              {b.status !== "Approved" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(b.id, b.status)}
                >
                  Cancel
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;