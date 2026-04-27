import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const AdminBookingsSkeleton = () => {
  return (
    <div className="booking-skeleton-container">

      {/* TITLE */}
      <div className="booking-title">
        <SkeletonBox width="250px" height="25px" />
      </div>

      {/* CARDS */}
      <div className="booking-cards">

        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="booking-card">

            {/* TITLE */}
            <SkeletonBox width="70%" height="20px" />

            {/* LOCATION */}
            <SkeletonBox width="40%" height="15px" />

            {/* PRICE */}
            <SkeletonBox width="30%" height="15px" />

            <div className="divider"></div>

            {/* USER */}
            <SkeletonBox width="80%" height="15px" />

            {/* EMAIL */}
            <SkeletonBox width="60%" height="15px" />

            {/* DATE */}
            <SkeletonBox width="40%" height="15px" />

            {/* STATUS */}
            <SkeletonBox
              width="90px"
              height="25px"
              style={{ borderRadius: "20px" }}
            />

            {/* ACTION */}
            <SkeletonBox width="120px" height="15px" />

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminBookingsSkeleton;