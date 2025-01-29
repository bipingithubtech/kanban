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

TaskRouter.post("/Reorder", async (req, res) => {
  const { taskId, fromList, toList, newIndex } = req.body;

  console.log("Request Body:", req.body);

  try {
    const fromListId = fromList.toString();
    const toListId = toList.toString();

    console.log("fromListId:", fromListId);
    console.log("toListId:", toListId);

    const fromListObj = await ListModel.findById(fromListId);
    const toListObj = await ListModel.findById(toListId);
    const taskObj = await TaskModel.findById(taskId); // Get full task details

    if (!fromListObj) {
      console.log("List not found for the given fromList ID");
      return res
        .status(404)
        .json({ message: "List not found for the given fromList ID" });
    }

    if (!toListObj) {
      console.log("List not found for the given toList ID");
      return res
        .status(404)
        .json({ message: "List not found for the given toList ID" });
    }

    if (!taskObj) {
      console.log("Task not found");
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Moving Task Between Different Lists
    if (fromListId !== toListId) {
      console.log("Moving task between different lists");

      // Remove task from old list
      await ListModel.updateOne(
        { _id: fromListId },
        { $pull: { tasks: taskId } }
      );

      // Add full task object to the new list at specific position
      await ListModel.updateOne(
        { _id: toListId },
        {
          $push: {
            tasks: {
              $each: [taskObj], // Push full task object
              $position: newIndex,
            },
          },
        }
      );
    }
    // ✅ Moving Task Within the Same List (Reordering)
    else {
      console.log("Moving task within the same list");

      // Find index of task
      const taskIndex = fromListObj.tasks.findIndex(
        (task) => task._id.toString() === taskId
      );

      if (taskIndex === -1) {
        console.log("Task not found in the list");
        return res.status(404).json({ message: "Task not found in the list" });
      }

      // Extract the task
      const task = fromListObj.tasks.splice(taskIndex, 1)[0];

      // Insert at new index
      fromListObj.tasks.splice(newIndex, 0, task);

      // Save the updated list
      await fromListObj.save();
    }

    console.log("Task order updated successfully");
    res.status(200).json({ message: "Task order updated successfully" });
  } catch (error) {
    console.error("Error updating task order:", error);
    res.status(500).json({ message: "Error updating task order", error });
  }
});
