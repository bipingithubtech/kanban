import React, { useState } from "react";
import "../css/Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Storage/Token";

export const LoginPage = () => {
  const { token, setToken } = useUser(); // Corrected useUser usage
  const [state, setState] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!state.email || !state.password) {
      alert("Please enter both email and password.");
      return;
    }
  
    try {
      const res = await axios.post(
        "https://kanban-yuql.onrender.com/api/Register/login",
        state,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
  
      console.log("Login successful:", res.data);
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed, try again.");
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={state.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-footer">Don’t have an account?</p>
      </div>
    </div>
  );
};
