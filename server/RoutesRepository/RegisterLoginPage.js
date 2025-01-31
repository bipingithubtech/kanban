import express from "express";
import UserModel from "../models/UserMode.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UserRoutes = express.Router();

UserRoutes.post("/signUP", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const newUser = new UserModel({
      name,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({ message: "user register sucessfully", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

UserRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      res.status(401).json({ message: "invalid credential" });
    } else {
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.jwt,
        { expiresIn: "1d" }
      );
      return res
        .status(200)
        .cookie("jwtToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          path: "/",
        })
        .json({
          message: "login sucessfully",
          token,
          user: { id: user._id, name: user.name, email: user.email },
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

UserRoutes.get("/refecth", async (req, res) => {
  const token = req.cookies.jwtToken;
  console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.jwt, (err, data) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.status(401).json({ message: "Invalid Token" });
    } else {
      console.log("Token verified successfully:", data);
      return res.status(200).json({ token });
    }
  });
});
