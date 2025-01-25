import express from "express";
import dotenv from "dotenv";
import DatabaseCofig from "./utility/database.js";
import { UserRoutes } from "./RoutesRepository/RegisterLoginPage.js";
import { BoardRoutes } from "./RoutesRepository/BoardRepo.js";
import { ListRoutes } from "./RoutesRepository/ListRopoRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
const port = 8000;
app.use(cookieParser());
app.use("/api/Register/", UserRoutes);
app.use("/api/Board/", BoardRoutes);
app.use("/api/List/", ListRoutes);
app.listen(port, () => {
  console.log(`lsitening to port ${port}`);
  DatabaseCofig();
});
