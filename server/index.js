import express from "express";
import dotenv from "dotenv";
import DatabaseCofig from "./utility/database.js";
dotenv.config();
const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`lsitening to port ${port}`);
  DatabaseCofig();
});
