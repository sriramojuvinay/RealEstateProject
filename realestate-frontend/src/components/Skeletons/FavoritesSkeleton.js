import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const FavoritesSkeleton = () => {
  return (
    <div className="favorites-skeleton-container">

      {/* TITLE */}
      <div className="favorites-title">
        <SkeletonBox width="220px" height="25px" />
      </div>

      {/* FAVORITE ITEMS */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="favorite-card">

          {/* LEFT IMAGE */}
          <SkeletonBox
            width="120px"
            height="80px"
            style={{ borderRadius: "10px" }}
          />

          {/* CENTER CONTENT */}
          <div className="favorite-info">
            <SkeletonBox width="180px" height="18px" />
            <SkeletonBox width="120px" height="14px" />
            <SkeletonBox width="100px" height="16px" />
          </div>

          {/* RIGHT DELETE BUTTON */}
          <SkeletonBox
            width="50px"
            height="50px"
            style={{ borderRadius: "10px" }}
          />

        </div>
      ))}

    </div>
  );
};

export default FavoritesSkeleton;