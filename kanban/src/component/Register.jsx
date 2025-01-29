import React, { useReducer } from "react";
import "../css/Auth.css";
import axios from "axios";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const initialState = {
    name: "",
    email: "",
    password: ""
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_FIELD":
        return {
          ...state,
          [action.field]: action.value
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const setChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_FIELD",
      field: name,
      value: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = state;

    if (!name || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/Register/signUP", {
        name,
        email,
        password
      });

      alert("Registration successful!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={state.name}
              placeholder="Enter your name"
              name="name"
              onChange={setChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={state.email}
              placeholder="Enter your email"
              name="email"
              onChange={setChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={state.password}
              placeholder="Enter your password"
              name="password"
              onChange={setChange}
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to={"/loginpage"}>Login</Link>
        </p>
      </div>
    </div>
  );
};
