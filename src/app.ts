import { config } from "dotenv";
config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

export const app = express();
app.use(express.json());

console.log("App running...");
// Auth routes
app.use("/auth", authRoutes);
// User routes
app.use("/users", userRoutes);
