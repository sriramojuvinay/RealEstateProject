import React, { useEffect, useState } from "react";
import "./ManageProperties.css";

const BASE_URL = "http://localhost:5000/api";

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

 
  useEffect(() => {
    fetch(`${BASE_URL}/Property`)
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);


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

 
  const confirmDelete = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);

    try {
      const res = await fetch(`${BASE_URL}/Property/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed ❌");
      }
    } catch {
      alert("Server error ❌");
    }

    setLoadingId(null);
    setDeleteId(null);
  };


  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BASE_URL}/Property/${editingProperty.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editingProperty,
            price: Number(editingProperty.price),
          }),
        }
      );

      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === editingProperty.id ? editingProperty : p
          )
        );
        setEditingProperty(null);
      } else {
        alert("Update failed ❌");
      }
    } catch {
      alert("Server error ❌");
    }
  };


  const handleSearch = async () => {
    const params = new URLSearchParams();

    if (location) params.append("location", location);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (type) params.append("type", type);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/Property/search?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setProperties(data);
    } else {
      alert("Search failed ❌");
    }
  };

  return (
    <div className="manage-container">
      <h2 className="manage-title">Manage Properties 🏠</h2>

      {/* 🔍 SEARCH BAR */}
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
              
              {/* 🔥 IMAGE */}
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

      
      {deleteId && (
        <div className="modal">
          <div className="modal-content">
            <p>Delete this property?</p>
            <button onClick={() => confirmDelete(deleteId)}>
              Yes
            </button>
            <button onClick={() => setDeleteId(null)}>Cancel</button>
          </div>
        </div>
      )}

      
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