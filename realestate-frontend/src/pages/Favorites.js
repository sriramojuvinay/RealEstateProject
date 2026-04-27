import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites, removeFavorite } from "../services/api";
import "./Favorites.css";
import FavoritesSkeleton from "../components/Skeletons/FavoritesSkeleton";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // 🔥 navigation


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setLoading(false);
          return;
        }

        const data = await getFavorites(userId);
        console.log("Favorites:", data);

        setFavorites(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  const handleRemove = async (propertyId) => {
    try {
      await removeFavorite(propertyId);

      setFavorites((prev) =>
        prev.filter((f) => f.propertyId !== propertyId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleNavigate = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading) return <FavoritesSkeleton />;

  return (
    <div className="favorites-container">
      <h2>My Favorites ❤️</h2>

      {favorites.length === 0 ? (
        <p className="no-favorites">No favorites yet ❌</p>
      ) : (
        favorites.map((f) => {
          const property = f.property;

          if (!property) {
            return (
              <div key={f.id} className="favorite-card">
                <p>⚠ Property not available</p>
              </div>
            );
          }

          const image =
            property.imageUrls && property.imageUrls.length > 0
              ? property.imageUrls[0]
              : "https://picsum.photos/400/250";

          return (
            <div
              className="favorite-card"
              key={f.id}
              onClick={() => handleNavigate(property.id)} 
            >
              <div className="favorite-left">
                <img
                  src={image}
                  alt="property"
                  className="favorite-image"
                />

                <div className="favorite-info">
                  <h3>{property.title}</h3>
                  <p>📍 {property.location}</p>
                  <p className="price">₹{property.price}</p>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleRemove(property.id);
                }}
              >
                ❌
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Favorites;