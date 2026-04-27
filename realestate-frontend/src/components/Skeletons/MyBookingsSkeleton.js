import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const MyBookingsSkeleton = () => {
  return (
    <div className="bookings-skeleton-container">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="booking-skeleton-card">

          {/* IMAGE */}
          <div className="skeleton-image">
            <SkeletonBox width="220px" height="150px" />
          </div>

          {/* TEXT */}
          <div className="skeleton-info">
            <SkeletonBox width="160px" height="20px" />
            <SkeletonBox width="120px" height="15px" />
            <SkeletonBox width="100px" height="18px" />
            <SkeletonBox width="140px" height="15px" />
            <SkeletonBox
              width="120px"
              height="25px"
              style={{ borderRadius: "20px" }}
            />
          </div>

          {/* BUTTON */}
          <SkeletonBox width="120px" height="35px" />

        </div>
      ))}
    </div>
  );
};

export default MyBookingsSkeleton;