import express from "express";
import dotenv from "dotenv";
import DatabaseCofig from "./utility/database.js";
import { UserRoutes } from "./RoutesRepository/RegisterLoginPage.js";
import { BoardRoutes } from "./RoutesRepository/BoardRepo.js";
import { ListRoutes } from "./RoutesRepository/ListRopoRoute.js";
import cookieParser from "cookie-parser";
import { TaskRouter } from "./RoutesRepository/Task.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "https://cheery-arithmetic-599aa8.netlify.app",

  credentials: true,
};
app.use(cors(corsOptions));
const port = process.env.PORT || 8000;
app.use(cookieParser());
app.use("/api/Register/", UserRoutes);
app.use("/api/Board/", BoardRoutes);
app.use("/api/List/", ListRoutes);
app.use("/api/task/", TaskRouter);
app.listen(port, () => {
  console.log(`lsitening to port ${port}`);
  DatabaseCofig();
});
