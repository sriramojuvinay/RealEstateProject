import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      
      {/* 🔹 SIDEBAR */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>

        <p className="admin-user">
          👋 Welcome, <strong>{adminName}</strong>
        </p>

        <NavLink
  to="/admin/dashboard"
  className={({ isActive }) =>
    isActive ? "admin-link active" : "admin-link"
  }
>
  📊 Dashboard
</NavLink>

<NavLink
  to="/admin/add"
  className={({ isActive }) =>
    isActive ? "admin-link active" : "admin-link"
  }
>
  ➕ Add Property
</NavLink>

<NavLink
  to="/admin/properties"
  className={({ isActive }) =>
    isActive ? "admin-link active" : "admin-link"
  }
>
  🏠 My Properties
</NavLink>

<NavLink
  to="/admin/bookings"
  className={({ isActive }) =>
    isActive ? "admin-link active" : "admin-link"
  }
>
  📅 Bookings
</NavLink>

<NavLink
  to="/admin/rentals"
  className={({ isActive }) =>
    isActive ? "admin-link active" : "admin-link"
  }
>
  💰 Rentals
</NavLink>
<NavLink
  to="/admin/chats"
  className={({ isActive }) =>
    isActive ? "admin-link active" : "admin-link"
  }
>💬Chats</NavLink>


        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* 🔹 CONTENT */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;