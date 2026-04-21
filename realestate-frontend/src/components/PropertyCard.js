import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/api";
import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(true);

  const images = property.imageUrls || [];

 
  useEffect(() => {
    setIndex(0);
  }, [property.id]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const favorites = await getFavorites(userId);

        const exists = favorites.some(
          (f) => f.propertyId === property.id
        );

        setIsFavorite(exists);
      } catch (err) {
        console.error("Favorite check error:", err);
      } finally {
        setLoadingFav(false);
      }
    };

    checkFavorite();
  }, [property.id]);

  
  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setIndex((prev) => (prev + 1) % images.length);
  };


  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };


  const handleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      if (isFavorite) {
        await removeFavorite(property.id);
        setIsFavorite(false);
      } else {
        await addFavorite(property.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };


  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const type =
  property.listingType?.toLowerCase() ||
  property.ListingType?.toLowerCase() ||
  "sell";

return (
  <div className="property-card" onClick={handleCardClick}>
    

    <div className="image-container">
      <img
        src={
          images.length > 0
            ? images[index]
            : `https://picsum.photos/400/250?random=${property.id}`
        }
        alt="property"
      />

  
      <span className={`badge ${type === "rent" ? "rent" : "sell"}`}>
      { type === "rent" ? "RENT" : "BUY"}
      </span>

    
      {images.length > 1 && (
        <>
          <button className="nav-btn prev" onClick={prevImage}>◀</button>
          <button className="nav-btn next" onClick={nextImage}>▶</button>
        </>
      )}

     
      {!loadingFav && (
        <button className="fav-btn" onClick={handleFavorite}>
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}
    </div>


    <div className="property-details">
      <h3>{property.title}</h3>

      <p className="location">📍 {property.location}</p>

    
      <p className="desc">
        {property.description?.length > 60
          ? property.description.slice(0, 60) + "..."
          : property.description}
      </p>

     
      <p className="price">
      ₹{property.price}
      {type === "rent" && <span className="per-month"> /month</span>}
    </p>
    </div>
  </div>
);
};

export default memo(PropertyCard);