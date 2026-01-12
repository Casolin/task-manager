import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  addTask,
  getTaskStats,
  taskList,
  editTask,
  deleteTask,
  usersTaskList,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", authenticate, taskList);
router.get("/stats", authenticate, getTaskStats);
router.get("/list", authenticate, usersTaskList);
router.post("/add", authenticate, addTask);
router.put("/edit/:id", authenticate, editTask);
router.delete("/delete/:id", authenticate, deleteTask);

export default router;
