import React, { useEffect, useState } from 'react';
import { useUser } from '../Storage/Token';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Dasboard.css'; 
import {DragDropContext,Droppable,Draggable} from "react-beautiful-dnd"
const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useUser();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("https://kanban-yuql.onrender.com/api/Board/userBorad", 
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
       );
      console.log('Fetched data:', res.data.lists)
      setData(res.data.lists);
    };
    fetch();
  }, [token]);

  const handleDragEnd = async (result) => {
    console.log('Drag result:', result); // Log the drag result
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    // Clone data to update state
    const updatedData = [...data];
  
    const sourceBoard = updatedData.find((board) => board._id === source.droppableId);
    const destinationBoard = updatedData.find((board) => board._id === destination.droppableId);
  
    if (!sourceBoard || !destinationBoard) {
      console.error('Source or destination board not found');
      return;
    }
  
    const movedTask = sourceBoard.tasks[source.index];
    console.log('Moved task:', movedTask); // Log the moved task
  
    // Remove from source and add to destination
    sourceBoard.tasks.splice(source.index, 1);
    destinationBoard.tasks.splice(destination.index, 0, movedTask);
  
    console.log('Updated data after move:', updatedData); // Log the updated data
  
    // Update state
    setData(updatedData);
  
    try {
      await axios.post(
        "https://kanban-yuql.onrender.com/api/task/Reorder",
        {
          taskId: movedTask._id,
          fromList: sourceBoard._id,
          toList: destinationBoard._id,
          newIndex: destination.index,
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true },
        
      );
    } catch (error) {
      console.error("Error updating task order:", error);
    }
  };
  


  return (
     <div className="dashboard">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back
      </button>
         
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="task-table">
              {data.length > 0 ? (
                data.map((board) => (
                  <Droppable key={board._id} droppableId={board._id}>
                    {(provided) => (
                      <div className="board-box" ref={provided.innerRef} {...provided.droppableProps}>
                        <h2>{board.title}</h2>
                        <div className="tasks-container">
                        {board.tasks.map((task, taskIndex) => {
  console.log('Task ID:', task._id); // Log the task ID
  return (
    <Draggable key={task._id} draggableId={task._id} index={taskIndex}>
      {(provided) => (
        <div
          className="task-box"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-details">
            <p>
              <strong>Task Title:</strong> {task.title}
            </p>
            <p>
              <strong>Description:</strong> {task.description}
            </p>
            <p>
              <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
})}

                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
          </DragDropContext>
        </div>
  );
};

export default Dashboard;
