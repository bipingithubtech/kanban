import mongoose from "mongoose";

const BoardSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  title: {
    type: String,
    default: "My Kanban Board",
    trim: true,
  },

  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListModel",
    },
  ],
});

const BoardModel = mongoose.model("BoardModel", BoardSchema);
export default BoardModel;
