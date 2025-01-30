import React, { useState } from "react";
import "../css/Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Storage/Token";

export const LoginPage = () => {
  const {token,setToken}=useUser(null)
  const [state, setState] = useState({ email: "", password: "" });
  const navigate=useNavigate()


  const setchange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const setlogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://kanban-yuql.onrender.com/api/Register/login",
        state,
        {
          withCredentials: true,
          }
      );
      console.log(res.data, "login successful");
     
      setToken(res.data)
      navigate("/")

    } catch (error) {
      console.error(
        error.response ? error.response.data : error.message
      );
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={setlogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={state.email}
              onChange={setchange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={state.password}
              onChange={setchange}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-footer">Don’t have an account?</p>
      </div>
    </div>
  );
};
