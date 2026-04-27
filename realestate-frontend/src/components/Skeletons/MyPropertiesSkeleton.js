import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const MyPropertiesSkeleton = () => {
  return (
    <div className="myprops-skeleton-container">

      {/* HEADER */}
      <div className="myprops-header">
        <SkeletonBox width="200px" height="25px" />
        <SkeletonBox width="100px" height="30px" style={{ borderRadius: "20px" }} />
      </div>

      {/* CARDS */}
      <div className="myprops-grid">

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="myprops-card">

            {/* IMAGE */}
            <div className="image-wrapper">
              <SkeletonBox height="180px" width="100%" />

              {/* BADGE */}
              <div className="badge-skeleton">
                <SkeletonBox width="60px" height="25px" style={{ borderRadius: "15px" }} />
              </div>
            </div>

            {/* TITLE */}
            <SkeletonBox width="70%" height="20px" />

            {/* LOCATION */}
            <SkeletonBox width="50%" height="15px" />

            {/* PRICE */}
            <SkeletonBox width="40%" height="18px" />

            {/* BUTTONS */}
            <div className="btn-row">
              <SkeletonBox width="80px" height="35px" />
              <SkeletonBox width="80px" height="35px" />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyPropertiesSkeleton;