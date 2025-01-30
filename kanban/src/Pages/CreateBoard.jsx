import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import the arrow icon
import "../css/CreateBoard.css";

const CreateBoard = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://kanban-yuql.onrender.com/api/Board/createBoard",
        { title },
        { withCredentials: true }
      );
      console.log(res.data);
      alert("Successfully created");
      navigate("/")
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="container">
      {/* Back Arrow */}
      <div className="back-arrow" onClick={() => navigate("/")}>
        <FaArrowLeft /> Home
      </div>

      <h1>Create New Board</h1>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="title">Board Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <button type="submit" className="btn btn-primary mt-3">
          Create Board
        </button>
      </form>
    </div>
  );
};

export default CreateBoard;















