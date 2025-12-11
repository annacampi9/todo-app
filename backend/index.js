import mongoose from "mongoose";
import dotenv from "dotenv";
import Todo from "./models/Todo.js";
dotenv.config();

import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Home route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({ text: req.body.text });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// Toggle completed
app.patch("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.completed = !todo.completed;
  await todo.save();

  res.json(todo);
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
