import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const AdminDashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">

      {/* TITLE */}
      <div className="dashboard-title">
        <SkeletonBox width="200px" height="25px" />
      </div>

      {/* STATS LIST */}
      <div className="stats-list">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-item">
            <SkeletonBox width="120px" height="18px" />
          </div>
        ))}
      </div>

      {/* CARDS */}
      <div className="cards-container">

        {/* Earnings Card */}
        <div className="dashboard-card">
          <SkeletonBox width="150px" height="20px" />
          <br />
          <SkeletonBox width="180px" height="35px" />
        </div>

        {/* Rentals Card */}
        <div className="dashboard-card">
          <SkeletonBox width="150px" height="20px" />
          <br />
          <SkeletonBox width="60px" height="35px" />
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardSkeleton;