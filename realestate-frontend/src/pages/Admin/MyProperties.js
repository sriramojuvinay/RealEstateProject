import { useEffect, useState } from "react";
import "./MyProperties.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/api/Property/my-properties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, []);

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_BASE}/api/Property/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  
  if (loading) return <h3 className="loading">Loading...</h3>;

  return (
    <div className="my-properties">

      <div className="header">
        <h2>🏠 My Properties</h2>
        <span>{properties.length} Listings</span>
      </div>

      <div className="grid">
        {properties.map((p) => (
          <div key={p.id} className="card">

            {/* IMAGE */}
            <div className="image-wrapper">
              <img
                src={
                  p.imageUrls?.length > 0
                    ? p.imageUrls[0]
                    : "https://via.placeholder.com/400x250"
                }
                alt=""
              />

              {/* ✅ SELL / RENT */}
            <span
              className={`badge ${
                p.listingType?.toLowerCase() === "rent"
                  ? "rent"
                  : "sell"
              }`}
            >
              {(p.listingType || "Sell").toUpperCase()}
            </span>
            </div>

            {/* DETAILS */}
            <div className="card-body">
              <h3>{p.title}</h3>
              <p className="location">📍 {p.location}</p>
              <h4 className="price">₹{p.price}</h4>

              <div className="actions">
                <button onClick={() => navigate(`/admin/edit/${p.id}`)}>
                   <FaEdit />  Edit
                </button>

                <button onClick={() => deleteProperty(p.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties;