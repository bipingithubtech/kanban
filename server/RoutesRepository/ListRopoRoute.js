import express from "express";
import { jwtMiddleware } from "../middleware/tokenMiddleware.js";
import ListModel from "../models/ListModel.js";
import BoardModel from "../models/BoardModel.js";

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
