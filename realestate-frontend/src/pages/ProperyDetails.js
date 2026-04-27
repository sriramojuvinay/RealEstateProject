import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getPropertyById,
  bookProperty,
  checkBooking
} from "../services/api";
import BookingSuccessModal from "../components/BookingSuccessModal";
import PropertyDetailsSkeleton from "../components/Skeletons/PropertyDetailsSkeleton";
import { toast } from "react-toastify";
import api from "../services/api";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedProperty = location.state;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);

  // 🔥 FETCH PROPERTY (OPTIMIZED)
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // ✅ USE PASSED DATA (FAST)
        if (passedProperty) {
          setProperty(passedProperty);
          setImages(passedProperty.imageUrls || []);
          setLoading(false);
          return;
        }

        // 🔄 FALLBACK API CALL
        const data = await getPropertyById(id);
        if (!data) return;

        setProperty(data);
        setImages(data.imageUrls || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load property ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, passedProperty]);

  // 🔥 IMAGE SLIDER
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  // 🔥 CHECK BOOKING
  useEffect(() => {
    const checkIfBooked = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || !property) return;

        const res = await checkBooking(userId, property.id);
        setAlreadyBooked(res);
      } catch (err) {
        console.error(err);
      }
    };

    checkIfBooked();
  }, [property]);

  // 🔥 BOOK PROPERTY
  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first ❗");
        return;
      }

      if (alreadyBooked) {
        toast.warning("Already booked ❗");
        return;
      }

      setBookingLoading(true);

      const payload = {
        userId: localStorage.getItem("userId"),
        propertyId: property.id,
        bookingDate: new Date().toISOString(),
        userName: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("email") || "test@mail.com"
      };

      await bookProperty(payload);

      toast.success("Booking request sent ⏳");
      setShowModal(true);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        toast.warning(err.response.data || "Already booked ❗");
      } else {
        toast.error("Booking failed ❌");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // 🔥 START CHAT
  const handleChat = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first ❗");
        return;
      }

      if (!property?.userId) {
        toast.error("Owner not found ❌");
        return;
      }

      const res = await api.post("/chat/start", {
        propertyId: property.id,
        adminId: property.userId
      });

      const conversationId = res.data.id;
      navigate(`/chat/${conversationId}`);

    } catch (err) {
      console.error("Chat start error:", err);
      toast.error("Failed to start chat ❌");
    }
  };

  const userRole = localStorage.getItem("role");

  // ✅ SKELETON
  if (loading) return <PropertyDetailsSkeleton />;

  // ❌ NOT FOUND
  if (!property) return <h2>Property not found ❌</h2>;

  return (
    <div className="details-container fade-in">

      {/* IMAGE */}
      <div className="details-image-container">
        <img
          src={images[index] || "/default-property.jpg"}
          alt="property"
          className="details-image"
        />
      </div>

      {/* DETAILS */}
      <div className="details-info">

        <h2>{property.title}</h2>
        <p>📍 {property.location}</p>
        <p>₹{property.price}</p>
        <p>{property.type}</p>
        <p>{property.description}</p>

        <div className="property-actions">

          <button
            className={`book-btn ${alreadyBooked ? "booked" : ""}`}
            onClick={handleBooking}
            disabled={bookingLoading || alreadyBooked}
          >
            {bookingLoading
              ? "Booking..."
              : alreadyBooked
                ? "✔ Already Booked"
                : "Book Now"}
          </button>

          {userRole === "User" && (
            <button onClick={handleChat}>
              💬 Chat with Owner
            </button>
          )}

        </div>

        <BookingSuccessModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default PropertyDetails;