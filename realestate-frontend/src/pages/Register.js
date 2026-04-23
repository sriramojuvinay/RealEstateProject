import React, { useState } from "react";
import api from "../services/api";
import "./Register.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
  
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        role
      });

     
      const loginRes = await api.post("/auth/login", {
        email,
        password
      }); 
      

      console.log("LOGIN RESPONSE:", loginRes.data);

     
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("userId", loginRes.data.userId);

     
      const userRole =
        loginRes.data.roles && loginRes.data.roles.length > 0
          ? loginRes.data.roles[0]
          : "User";

      localStorage.setItem("role", userRole);

      alert("Registration successful ✅");

      window.location.href = "/";
    } catch (err) {
      console.error("ERROR:", err.response?.data || err);

      // 🔥 SAFE ERROR DISPLAY
      const errors = err.response?.data;

      if (Array.isArray(errors)) {
        alert(errors.map(e => e.description).join("\n"));
      } else if (typeof errors === "string") {
        alert(errors);
      } else {
        alert("Registration failed ❌");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register 🏠</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (Ex: Admin@123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;