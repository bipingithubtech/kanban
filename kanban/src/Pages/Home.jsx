import { useUser } from "../Storage/Token";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/HomePage.css";

const HomePage = () => {
  const { token, setToken } = useUser(); // Assuming setToken exists for logout
  const [boards, setBoards] = useState();
  const navigate = useNavigate();

  console.log("board data", boards);

  useEffect(() => {
    const fetch = async () => {
      if (!token) {
        console.log("No token available.");
        return;
      }

      console.log("Sending token from home page:", token);

      try {
        const res = await axios.get(
          "https://kanban-yuql.onrender.com/api/Board/userBorad",
          { withCredentials: true }
        );
        console.log("API Response:", res.data);
        setBoards(res.data);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetch();
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.get("https://kanban-yuql.onrender.com/api/Register/logout", {
        withCredentials: true,
      });

      setToken(null); // Clear token
      navigate("/register"); // Redirect to login page
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to the Board Management System</h1>
        <p>Your one-stop solution for managing tasks, lists, and boards</p>

        <div className="cta-buttons">
          {token ? (
            <>
              {!boards ? (
                <Link to="/createBoard" className="btn btn-primary btn-sm">
                  Create Board
                </Link>
              ) : (
                <Link to="/Board" className="btn btn-primary btn-sm">
                  Make List
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/loginpage" className="btn btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
