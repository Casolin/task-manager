import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import startDB from "./src/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import taskRouter from "./src/routes/taskRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import path from "path";

const app = express();

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.get("/", (req, res) => res.send("Welcome User"));
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

await startDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${process.env.PORT || 3000}`);
});
