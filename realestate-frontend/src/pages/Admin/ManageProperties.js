import React, { useEffect, useState } from "react";
import "./ManageProperties.css";
import api from "../../services/api"; // ✅ IMPORTANT

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const [imageIndexes, setImageIndexes] = useState({});

  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");

  // ✅ FETCH PROPERTIES
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await api.get("/property");
        setProperties(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    loadProperties();
  }, []);

  // IMAGE NAVIGATION
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

  // ✅ DELETE PROPERTY
  const confirmDelete = async (id) => {
    setLoadingId(id);

    try {
      await api.delete(`/property/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }

    setLoadingId(null);
    setDeleteId(null);
  };

  // ✅ UPDATE PROPERTY
  const handleUpdate = async () => {
    try {
      await api.put(`/property/${editingProperty.id}`, {
        ...editingProperty,
        price: Number(editingProperty.price),
      });

      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingProperty.id ? editingProperty : p
        )
      );

      setEditingProperty(null);
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  // ✅ SEARCH
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();

      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (type) params.append("type", type);

      const res = await api.get(`/property/search?${params}`);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed ❌");
    }
  };

  return (
    <div className="manage-container">
      <h2 className="manage-title">Manage Properties 🏠</h2>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
        </select>

        <button onClick={handleSearch}>Search 🔍</button>
      </div>

      {/* PROPERTY GRID */}
      <div className="manage-grid">
        {properties.map((p) => {
          let images = [];

          try {
            images = p.imageUrls ? JSON.parse(p.imageUrls) : [];
          } catch {
            images = [];
          }

          const index = imageIndexes[p.id] || 0;

          const currentImage =
            images.length > 0
              ? images[index]
              : "https://images.unsplash.com/photo-1560185127-6ed189bf02f4";

          return (
            <div className="manage-card" key={p.id}>
              <div className="image-wrapper">
                <img src={currentImage} alt={p.title} />

                {images.length > 1 && (
                  <>
                    <button
                      className="prev-btn"
                      onClick={() => prevImage(p.id, images)}
                    >
                      ◀
                    </button>
                    <button
                      className="next-btn"
                      onClick={() => nextImage(p.id, images)}
                    >
                      ▶
                    </button>
                  </>
                )}

                <span className={`badge ${p.listingType}`}>
                  {p.listingType === "Rent" ? "Rent" : "Buy"}
                </span>
              </div>

              <div className="card-content">
                <h3>{p.title}</h3>
                <p>📍 {p.location}</p>

                <p className="manage-desc">
                  {p.description
                    ? p.description.substring(0, 60) + "..."
                    : "No description"}
                </p>

                <p className="manage-price">
                  ₹{p.price}
                  {p.listingType === "Rent" && " /month"}
                </p>
              </div>

              <div className="manage-actions">
                <button
                  className="delete-btn"
                  onClick={() => setDeleteId(p.id)}
                >
                  {loadingId === p.id ? "Deleting..." : "Delete ❌"}
                </button>

                <button
                  className="edit-btn"
                  onClick={() => setEditingProperty(p)}
                >
                  Edit ✏️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modal">
          <div className="modal-content">
            <p>Delete this property?</p>
            <button onClick={() => confirmDelete(deleteId)}>Yes</button>
            <button onClick={() => setDeleteId(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProperty && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Property</h3>

            <input
              value={editingProperty.title}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  title: e.target.value,
                })
              }
            />

            <input
              value={editingProperty.location}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  location: e.target.value,
                })
              }
            />

            <input
              type="number"
              value={editingProperty.price}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  price: e.target.value,
                })
              }
            />

            <textarea
              value={editingProperty.description || ""}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  description: e.target.value,
                })
              }
            />

            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setEditingProperty(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;