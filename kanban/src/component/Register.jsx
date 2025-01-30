import React, { useReducer } from "react";
import "../css/Auth.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const initialState = { name: "", email: "", password: "" };

  const reducer = (state, action) => {
    if (action.type === "SET_FIELD") {
      return { ...state, [action.field]: action.value };
    }
    return state;
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.name || !state.email || !state.password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post(
        "https://kanban-yuql.onrender.com/api/Register/signUP",
        state,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      alert("Registration successful! Redirecting to login...");
      navigate("/loginpage");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed, try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={state.name} onChange={handleChange} placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={state.password} onChange={handleChange} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/loginpage">Login</Link>
        </p>
      </div>
    </div>
  );
};
