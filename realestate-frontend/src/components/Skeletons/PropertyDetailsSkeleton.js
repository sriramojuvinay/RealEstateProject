import React from "react";
import "./PropertySkeleton.css";

const PropertyDetailsSkeleton = () => {
  return (
    <div className="details-container">

      {/* IMAGE */}
      <div className="details-image-container">
        <div className="skeleton-image shimmer large"></div>
      </div>

      {/* DETAILS */}
      <div className="details-info">

        <div className="skeleton-line shimmer title"></div>
        <div className="skeleton-line shimmer small"></div>
        <div className="skeleton-line shimmer small"></div>
        <div className="skeleton-line shimmer small"></div>

        <div className="skeleton-line shimmer"></div>
        <div className="skeleton-line shimmer"></div>
        <div className="skeleton-line shimmer"></div>

        <div className="skeleton-button shimmer"></div>

      </div>
    </div>
  );
};

export default PropertyDetailsSkeleton;