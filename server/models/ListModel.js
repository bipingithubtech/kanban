import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardModel",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskModel",
      },
    ],
  },
  { timestamps: true }
);

const ListModel = mongoose.model("ListModel", listSchema);
export default ListModel;
