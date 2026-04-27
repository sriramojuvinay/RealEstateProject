import React from "react";
import "./PropertySkeleton.css";

const SkeletonBox = ({ height, width, style }) => {
  return (
    <div
      className="shimmer"
      style={{
        height,
        width,
        borderRadius: "8px",
        ...style
      }}
    />
  );
};

export default SkeletonBox;