import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css'; // Custom styles for the HomePage
import { useUser } from '../Storage/Token';
import axios from 'axios';

const HomePage = () => {
  const { token } = useUser();
  const [boards, setBoards] = useState();
  console.log(boards)

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:8000/api/Board/userBorad", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token?.token}`, // Include token
        },
      });
      setBoards(res.data);
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
              {!boards? (
                // If no boards are created, show Create Board button
                <Link to="/createBoard" className="btn btn-primary">Create Board</Link>
              ) : (
                // If there are boards, show Make List button
                <Link to="/Board" className="btn btn-primary">Make List</Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            </>
          ) : (
            // If user is NOT logged in, show Login & Register buttons
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

export default HomePage;
