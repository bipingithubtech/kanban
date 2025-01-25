import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchemea = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    kanbanBoard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardModel",
    },
  },
  { timestamps: true }
);
userSchemea.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const UserModel = mongoose.model("UserModel", userSchemea);
export default UserModel;
