import express from "express";
import TaskModel from "../models/TaskModel.js";
import ListModel from "../models/ListModel.js";
import { jwtMiddleware } from "../middleware/tokenMiddleware.js";

export const TaskRouter = express.Router();

TaskRouter.post("/crateTask", jwtMiddleware, async (req, res) => {
  const { listId, title, description, dueDate, priority } = req.body;

  try {
    const task = await TaskModel.create({
      listId,
      title,
      description,
      dueDate,
      priority,
    });
    await ListModel.findByIdAndUpdate(listId, { $push: { tasks: task._id } });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});
