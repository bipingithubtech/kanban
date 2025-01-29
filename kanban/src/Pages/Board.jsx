import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Board.css";
import { useUser } from "../Storage/Token";
import { useNavigate } from 'react-router-dom';

const KanbanBoard = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [listTitle, setListTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedListId, setSelectedListId] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const { token } = useUser();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/Board/userBorad", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token?.token}`,
          },
        });
        setBoard(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching board:", err);
        setError("Failed to fetch board data");
      }
    };

    fetchBoard();
  }, [token]);

  const handleAddList = async () => {
    if (!listTitle) {
      alert("List title cannot be empty");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/List/CreateList",
        { title: listTitle, boardId: board._id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token?.token}`,
          },
        }
      );

      const updatedBoard = await axios.get("http://localhost:8000/api/Board/userBorad", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token?.token}` },
      });

      setBoard(updatedBoard.data);
      setListTitle("");
    } catch (err) {
      console.error("Error adding list:", err.response?.data || err);
      setError("Failed to add list");
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle || !selectedListId) {
      alert("Select a list and provide a task title");
      return;
    }

    const taskData = {
      listId: selectedListId,
      title: taskTitle,
      description: description,
      dueDate: dueDate,
      priority: priority,
    };

    try {
      if (taskToUpdate) {
        await axios.put(
          `http://localhost:8000/api/task/taskUpdate/${taskToUpdate._id}`,
          taskData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token?.token}`,
            },
          }
        );
        setTaskToUpdate(null);
        alert("Task updated successfully");
      } else {
        await axios.post(
          "http://localhost:8000/api/task/crateTask",
          taskData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token?.token}`,
            },
          }
        );
        alert("Task added successfully");
      }

      const updatedBoard = await axios.get("http://localhost:8000/api/Board/userBorad", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token?.token}` },
      });

      setBoard(updatedBoard.data);
      setTaskTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setSelectedListId(null);
    } catch (err) {
      console.error("Error adding or updating task:", err.response?.data || err);
      setError("Failed to add or update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/task/deleteTask/${taskId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token?.token}` },
      });

      const updatedBoard = await axios.get("http://localhost:8000/api/Board/userBorad", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token?.token}` },
      });
      setBoard(updatedBoard.data);
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err);
      setError("Failed to delete task");
    }
  };

  if (!token) return <div>Loading...</div>;

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (!board) return <div>No board found.</div>;

  return (
    <div className="container mt-5">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back
      </button>
      
      <h1>Manage Your Boards</h1>
      <h2>Board Title: {board.title}</h2>

      {/* Add List Section */}
      <div className="add-section">
        <input
          type="text"
          placeholder="Enter list title"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          className="input"
        />
        <button onClick={handleAddList} className="btn btn-primary">
          Add List
        </button>
      </div>

      {/* Display Lists */}
      <div className="lists-container">
        {board.lists.map((list) => (
          <div key={list._id} className="list">
            <h3>{list.title}</h3>

            <div className="add-task">
              <input
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => {
                  setTaskTitle(e.target.value);
                  setSelectedListId(list._id);
                }}
                className="input"
              />
              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button onClick={handleAddTask} className="btn btn-secondary">
                {taskToUpdate ? "Update Task" : "Add Task"}
              </button>
            </div>

            {/* Display Tasks */}
            <div className="tasks">
              {list.tasks.map((task) => (
                <div key={task._id} className="task">
                  
                  <button
                    onClick={() => {
                      setTaskToUpdate(task);
                      setTaskTitle(task.title);
                      setDescription(task.description);
                      setDueDate(task.dueDate);
                      setPriority(task.priority);
                      setSelectedListId(list._id);
                    }}
                    className="btn btn-info"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
