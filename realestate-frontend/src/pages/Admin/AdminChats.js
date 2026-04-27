import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminChats.css";
import api from "../../services/api"; // ✅ FIXED
import AdminChatSkeleton from "../../components/Skeletons/AdminChatSkeleton";
const AdminChats = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat/admin"); // ✅ FIXED
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <AdminChatSkeleton /  >;

  return (
    <div className="admin-chats">
      <h2>💬 Admin Chats</h2>

      {conversations.length === 0 ? (
        <p className="empty">No chats available</p>
      ) : (
        conversations.map((c) => (
          <div
            key={c.id}
            className="chat-card"
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            {/* PROPERTY INFO */}
            <div className="chat-info">
              <h3>{c.property?.title || "Property"}</h3>
              <p>📍 {c.property?.location || "Location"}</p>

              {/* USER */}
              <p className="user">
                👤 User ID: {c.userId}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="chat-meta">
              <span className="open-btn">Open ➜</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminChats;