import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Invalid email or password ❌");
        return;
      }

      const data = await res.json();

      if (!data.token) {
        alert("Login failed ❌");
        return;
      }

      
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      const role = data.roles ? data.roles[0] : data.role;
      localStorage.setItem("role", role);

     
      localStorage.setItem("userName", data.email || "Admin");

      

   
      if (role === "Admin") {
        window.location.replace("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className = "login-page">
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />

      <button onClick={handleLogin} className="login-button">
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
    </div>
  );
};

export default Login;