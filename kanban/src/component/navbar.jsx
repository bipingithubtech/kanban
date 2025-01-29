
import React from "react";
import { Link } from "react-router-dom";
import "../css/nav.css"; // Custom styles for the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Board System
        </Link>
        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          ☰
        </label>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/createBoard">Create Board</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
