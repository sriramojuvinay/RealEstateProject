import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "./Chat.css";

const Chat = () => {
  const { id } = useParams();
  const conversationId = parseInt(id);

  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [propertyInfo, setPropertyInfo] = useState(null);

  const userId = localStorage.getItem("userId");

  // ✅ LOAD OLD MESSAGES (WITH NAME)
  useEffect(() => {
    const loadMessages = async () => {
      try {
       const res = await api.get(`/chat/${conversationId}`);

        setPropertyInfo({
          name: res.data.propertyName,
          location: res.data.propertyLocation
        });

        const formatted = res.data.messages.map(m => ({
          senderId: m.senderId,
          senderName: m.senderName,
          text: m.text
        }));

        setMessages(formatted);

      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    };

    loadMessages();
  }, [conversationId]);

  // ✅ CREATE CONNECTION
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // ✅ START CONNECTION
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("✅ Connected to chat");

        connection.invoke("JoinConversation", conversationId);

        // ✅ RECEIVE MESSAGE (WITH NAME)
        connection.on("ReceiveMessage", (senderId, senderName, message) => {
          setMessages(prev => [
            ...prev,
            {
              senderId,
              senderName,
              text: message
            }
          ]);
        });
      })
      .catch(err => console.error("❌ Connection error:", err));

    return () => {
      connection.off("ReceiveMessage");
    };

  }, [connection, conversationId]);

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim()) return;

    if (!connection || connection.state !== "Connected") {
      console.error("❌ SignalR not connected");
      return;
    }

    try {
      await connection.invoke(
        "SendMessage",
        conversationId,
        userId,
        text
      );

      setText("");

    } catch (err) {
      console.error("❌ Send error:", err);
    }
  };

  // ✅ AUTO SCROLL
  useEffect(() => {
    const container = document.querySelector(".chat-messages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-wrapper">

      {/* HEADER */}
      <div className="chat-header">
  💬 {propertyInfo?.name || "Property"}
      <div className="chat-sub">
        📍 {propertyInfo?.location}
      </div>
    </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((m, i) => {
          const isMe = m.senderId === userId;

          return (
            <div
              key={i}
              className={`chat-row ${isMe ? "me" : "other"}`}
            >
              <div className="chat-bubble">

                {/* ✅ NAME */}
                <div className="chat-name">
                  {isMe ? "You" : m.senderName || "User"}
                </div>

                {/* MESSAGE */}
                <div>{m.text}</div>

              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="chat-input-bar">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
};

export default Chat;