import React, { useEffect, useState } from "react";
import { getProperties } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import "./Properties.css";
import PropertySkeleton from "../components/PropertySkeleton";

const Properties = () => {
  const [properties, setProperties] = useState([]);


  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");
  const [purpose, setPurpose] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProperties();
        setProperties(data || []); // ✅ SAFE
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const filteredProperties = properties
    ?.filter((p) =>
      p.location?.toLowerCase().includes(location.toLowerCase())
    )
    ?.filter((p) =>
      maxPrice ? p.price <= parseInt(maxPrice) : true
    )
    ?.filter((p) =>
      type ? p.type === type : true
    )
    ?.filter((p) =>
      purpose === "All" ? true : p.listingType === purpose
    );

  return (
    <div className="properties-container">
      <h2 className="properties-title">Find Your Dream Property 🏡</h2>

     
      <div className="filters">

        <input
          type="text"
          placeholder="📍 Search location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          placeholder="💰 Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
        </select>

        
        <div className="purpose-buttons">
          <button
            className={purpose === "All" ? "active" : ""}
            onClick={() => setPurpose("All")}
          >
            All
          </button>

          <button
            className={purpose === "Sell" ? "active" : ""}
            onClick={() => setPurpose("Sell")}
          >
            Buy
          </button>

          <button
            className={purpose === "Rent" ? "active" : ""}
            onClick={() => setPurpose("Rent")}
          >
            Rent
          </button>
        </div>
      </div>

      
      <div className="properties-grid">

 
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <PropertySkeleton key={i} />)
        ) : filteredProperties.length === 0 ? (

         
          <div className="empty-state">
            <h3>No properties found 😢</h3>
            <p>Try adjusting filters</p>
          </div>

        ) : (

          
          filteredProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))

        )}

      </div>
    </div>
  );
};

export default Properties;