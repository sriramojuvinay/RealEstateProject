import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // ✅ USE API.JS
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // ✅ CALL BACKEND CORRECTLY
      const data = await loginUser({ email, password });

      if (!data.token) {
        alert("Login failed ❌");
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      const role = data.roles ? data.roles[0] : data.role;
      localStorage.setItem("role", role);

      localStorage.setItem("userName", data.email || "User");

      // ✅ REDIRECT
      if (role === "Admin") {
        window.location.replace("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert(error.response.data?.message || "Invalid credentials ❌");
      } else {
        alert("Server not reachable ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
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