import SkeletonBox from "./SkeletonBox";
import "./Skeleton.css";

const AdminChatSkeleton = () => {
  return (
    <div className="chat-skeleton-container">

      {/* TITLE */}
      <div className="chat-title">
        <SkeletonBox width="200px" height="25px" />
      </div>

      {/* CHAT ITEMS */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="chat-card">

          {/* LEFT SIDE */}
          <div className="chat-left">

            {/* PROPERTY */}
            <SkeletonBox width="150px" height="18px" />

            {/* LOCATION */}
            <SkeletonBox width="100px" height="14px" />

            {/* USER ID */}
            <SkeletonBox width="250px" height="14px" />

          </div>

          {/* RIGHT BUTTON */}
          <div className="chat-right">
            <SkeletonBox width="80px" height="35px" />
          </div>

        </div>
      ))}

    </div>
  );
};

export default AdminChatSkeleton;