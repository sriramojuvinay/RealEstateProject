     import React, { useEffect, useState } from "react";
import api from "../../services/api"; 
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [propertiesRes, bookingsRes, usersRes] = await Promise.all([
          api.get("/property"),          
          api.get("/bookings/all"),      
          api.get("/auth/users"),        
        ]);

        setStats({
          properties: propertiesRes.data?.length || 0,
          bookings: bookingsRes.data?.length || 0,
          users: usersRes.data?.length || 0,
        });

      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/dashboard/earnings");
        setEarnings(res.data);
      } catch (err) {
        console.error("Earnings error:", err);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <h2>Loading stats...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Dashboard Stats</h2>

      <div style={{ marginTop: "20px" }}>
        <p>🏠 Properties: {stats.properties}</p>
        <p>📅 Bookings: {stats.bookings}</p>
        <p>👤 Users: {stats.users}</p>
      </div>

      <div className="earnings-dashboard">
        <div className="card">
          <h3>Total Earnings</h3>
          <h2>₹{earnings?.totalEarnings || 0}</h2>
        </div>

        <div className="card">
          <h3>Active Rentals</h3>
          <h2>{earnings?.activeRentals || 0}</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;