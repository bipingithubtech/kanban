import express from "express";
import BoardModel from "../models/BoardModel.js";
import { jwtMiddleware } from "../middleware/tokenMiddleware.js";
import ListModel from "../models/ListModel.js";
import TaskModel from "../models/TaskModel.js";

export const BoardRoutes = express.Router();

BoardRoutes.post("/createBoard", jwtMiddleware, async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  try {
    const board = await BoardModel.create({ userId, title });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Error creating board", error });
  }
});
// getting board of particular user
BoardRoutes.get("/:userId", jwtMiddleware, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  if (userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Unauthorized access to this board." });
  }

  try {
    const board = await BoardModel.findOne({ userId }).populate("lists");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ message: "Error fetching the board." });
  }
});

// updating board title
BoardRoutes.put("/boards/:boardId", async (req, res) => {
  const boardId = req.params;
  const { title } = req.body;
  try {
    const updatedBoard = await BoardModel.findByIdAndUpdate(
      { boardId },
      { $set: { title } },
      { new: true }
    );
    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }
    res
      .status(200)
      .json({ message: "Board updated successfully", updatedBoard });
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board", error });
  }
});

//  deletting all data associated with one use one boead
BoardRoutes.delete("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await BoardModel.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const list = await ListModel.find({ boardId });
    const listIds = list.map((list) => list._id);
    await TaskModel.deleteMany({ listId: { $in: listIds } });
    await ListModel.deleteMany({ boardId });

    await BoardModel.findByIdAndDelete(boardId);
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Error deleting board", error });
  }
});

BoardRoutes.put("/reorderLists", async (req, res) => {
  const { boardId, listOrder } = req.body;
  try {
    const board = await BoardModel.findByIdAndUpdate(
      boardId,
      { lists: listOrder },
      { new: true }
    );
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).json(board);
  } catch (error) {
    console.error("Error reordering lists:", error);
    res.status(500).json({ message: "Error reordering lists", error });
  }
});
