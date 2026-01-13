import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getUsers, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", authenticate, getUsers);
userRouter.delete("/delete/:id", authenticate, deleteUser);

export default userRouter;
