import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import "./Home.css";

const BASE_URL = "http://localhost:5000/api";

const heroImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
];

const showcaseImages = [
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  "https://images.unsplash.com/photo-1599423300746-b62533397364"
];

const Home = () => {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);

  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");
  const [listingType, setListingType] = useState("All");

  // 🔥 HERO IMAGE SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 FETCH PROPERTIES
  useEffect(() => {
    fetch(`${BASE_URL}/Property`)
      .then((res) => res.json())
      .then((data) => {
        setAllProperties(data);
        setFeatured(data.slice(0, 3));
        setLatest(data.slice(3, 9));
      });
  }, []);

  // 🔥 FILTER FUNCTION (FIXED WITH useCallback)
  const applyFilters = useCallback(() => {
    let result = [...allProperties];

    if (location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (type) {
      result = result.filter((p) => p.type === type);
    }

 if (listingType !== "All") {
  result = result.filter(
    (p) =>
      (p.ListingType || "").toLowerCase() === listingType.toLowerCase()
  );
}
    setLatest(result.slice(0, 6));
  }, [allProperties, location, minPrice, maxPrice, type, listingType]);

  // 🔥 APPLY FILTER ON LISTING TYPE CHANGE
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // 🔥 SEARCH BUTTON
  const handleSearch = () => {
    applyFilters();
  };

  return (
    <div className="home">

      {/* HERO SECTION */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${heroImages[currentImage]})`
        }}
      >
        <div className="hero-overlay fade-in">
          <h1>Find Your Dream Home 🏡</h1>
          <p>Buy or Rent the best properties easily</p>

          <div className="search-box slide-up">
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
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="filters fade-in">
        <button onClick={() => setListingType("All")}>All</button>
        <button onClick={() => setListingType("Sell")}>Buy</button>
        <button onClick={() => setListingType("Rent")}>Rent</button>
      </div>

      {/* FEATURED */}
      <div className="property-section fade-in">
        <h2>⭐ Featured Properties</h2>
        <div className="property-grid">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>

      {/* IMAGE SHOWCASE */}
      <div className="image-showcase fade-in">
        <h2>🏡 Explore Beautiful Homes</h2>
        <div className="showcase-grid">
          {showcaseImages.map((img, i) => (
            <img key={i} src={img} alt="home" />
          ))}
        </div>
      </div>

      {/* LATEST */}
      <div className="property-section fade-in">
        <h2>🆕 Latest Properties</h2>
        <div className="property-grid">
          {latest.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        <div className="view-all">
          <button onClick={() => navigate("/properties")}>
            View All Properties →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;