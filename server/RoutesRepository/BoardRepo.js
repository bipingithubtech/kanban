import express from "express";
import BoardModel from "../models/BoardModel.js";
import { jwtMiddleware } from "../middleware/tokenMiddleware.js";

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

BoardRoutes.get("/:userId", jwtMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const board = await BoardModel.findOne({ userId }).populate("lists");
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(500).json({ message: "Error fetching board", error });
  } catch (error) {
    res.status(500).json({ message: "Error fetching board", error });
  }
});
