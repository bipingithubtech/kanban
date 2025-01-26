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

TaskRouter.get("/task/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    const taks = await TaskModel.find({ listId }).populate("listId");
    res.status(200).json(taks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// get task of specific id
TaskRouter.get("/task/:id", jwtMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch {
    res.status(500).json({ message: "Error fetching task", error });
  }
});

TaskRouter.put("/taskUpdate/:id", jwtMiddleware, async (req, res) => {
  const { id } = req.params;

  const { title, description, dueDate, priority } = req.body;

  try {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { $set: { title, description, dueDate, priority } },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

TaskRouter.delete("/deleteTask/:id", jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await ListModel.findByIdAndUpdate(task.listId, {
      $pull: { tasks: task._id },
    });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});
