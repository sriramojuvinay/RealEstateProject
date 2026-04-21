import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminChats.css";

const AdminChats = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat/admin",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  

  if (loading) return <h3 style={{ padding: "20px" }}>Loading chats...</h3>;

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