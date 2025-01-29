import express from "express";
import { jwtMiddleware } from "../middleware/tokenMiddleware.js";
import ListModel from "../models/ListModel.js";
import BoardModel from "../models/BoardModel.js";
import TaskModel from "../models/TaskModel.js";

export const ListRoutes = express.Router();

ListRoutes.post("/CreateList", jwtMiddleware, async (req, res) => {
  const { boardId, title } = req.body;

  if (!boardId || !title) {
    return res.status(400).json({ message: "Board ID and title are required" });
  }

  try {
    const list = await ListModel.create({ boardId, title });
    await BoardModel.findByIdAndUpdate(boardId, {
      $push: { lists: list._id },
    });
    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating list", error });
  }
});

ListRoutes.get("/getAllList/:boardId", async (req, res) => {
  const { boardId } = req.params;
  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }
  try {
    const lists = await ListModel.find({ boardId }).populate("tasks");
    if (!lists || lists.length === 0) {
      return res.status(404).json({ message: "No lists found for this board" });
    }
    res.status(200).json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ message: "Error fetching lists", error });
  }
});

// delete the list which user had made
ListRoutes.delete("/delete/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    if (!listId) {
      return res.status(400).json({ message: "List ID is required" });
    }

    const list = await ListModel.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const { boardId, tasks } = list;
    await TaskModel.deleteMany({ _id: { $in: tasks } });
    await BoardModel.findByIdAndUpdate(boardId, { $pull: { lists: listId } });
    await ListModel.findByIdAndDelete(listId);
    res
      .status(200)
      .json({ message: "List and associated tasks deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Error deleting list", error });
  }
});

ListRoutes.put("update/:listId", async (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;

  try {
    const listupdated = await ListModel.findByIdAndUpdate(
      listId,
      { $set: { title } },
      { new: true }
    );

    res.status(200).json({ message: "list updated successfully", listupdated });
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board", error });
  }
});
ListRoutes.put("/reorderTasks", async (req, res) => {
  const { listId, taskOrder } = req.body;
  try {
    const list = await ListModel.findByIdAndUpdate(
      listId,
      { tasks: taskOrder },
      { new: true }
    );
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json(list);
  } catch (error) {
    console.error("Error reordering tasks:", error);
    res.status(500).json({ message: "Error reordering tasks", error });
  }
});
