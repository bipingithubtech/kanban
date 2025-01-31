import { useUser } from "../Storage/Token";
import { useState,useEffect, } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const HomePage = () => {
  const { token } = useUser();
  const [boards, setBoards] = useState();

  useEffect(() => {
    const fetch = async () => {
      if (!token) {
        console.log("No token available.");
        return;  // Don't make the request if there's no token
      }

      console.log("Sending token:", token);  // Log token

      try {
        const res = await axios.get("https://kanban-yuql.onrender.com/api/Board/userBorad", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        console.log("API Response:", res.data);  // Log the response data
        setBoards(res.data);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetch();
  }, [token]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to the Board Management System</h1>
        <p>Your one-stop solution for managing tasks, lists, and boards</p>
        
        <div className="cta-buttons">
          {token ? (
            <>
              {!boards ? (
                <Link to="/createBoard" className="btn btn-primary">Create Board</Link>
              ) : (
                <Link to="/Board" className="btn btn-primary">Make List</Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/loginpage" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage