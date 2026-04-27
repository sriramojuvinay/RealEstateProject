import React from "react";
import "./PropertySkeleton.css";

const PropertySkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>

      <div className="skeleton-content">
        <div className="skeleton-line shimmer"></div>
        <div className="skeleton-line small shimmer"></div>
        <div className="skeleton-line shimmer"></div>
        <div className="skeleton-line small shimmer"></div>
      </div>
    </div>
  );
};

export default PropertySkeleton;