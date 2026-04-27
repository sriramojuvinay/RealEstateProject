import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const AdminRentalsSkeleton = () => {
  return (
    <div className="rentals-skeleton-container">

      {/* TITLE */}
      <div className="rentals-title">
        <SkeletonBox width="300px" height="25px" />
      </div>

      {/* TABLE HEADER */}
      <div className="rentals-header">
        <SkeletonBox width="15%" height="18px" />
        <SkeletonBox width="15%" height="18px" />
        <SkeletonBox width="15%" height="18px" />
        <SkeletonBox width="10%" height="18px" />
        <SkeletonBox width="15%" height="18px" />
        <SkeletonBox width="15%" height="18px" />
      </div>

      {/* ROWS */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rentals-row">

          {/* PROPERTY (IMAGE + TEXT) */}
          <div className="property-cell">
            <SkeletonBox width="50px" height="50px" style={{ borderRadius: "8px" }} />
            <SkeletonBox width="120px" height="15px" />
          </div>

          {/* TENANT */}
          <SkeletonBox width="150px" height="15px" />

          {/* RENT */}
          <SkeletonBox width="80px" height="15px" />

          {/* STATUS */}
          <SkeletonBox
            width="70px"
            height="25px"
            style={{ borderRadius: "20px" }}
          />

          {/* TOTAL */}
          <SkeletonBox width="90px" height="15px" />

          {/* ACTION */}
          <div className="action-buttons">
            <SkeletonBox width="60px" height="30px" />
            <SkeletonBox width="60px" height="30px" />
          </div>

        </div>
      ))}

    </div>
  );
};

export default AdminRentalsSkeleton;