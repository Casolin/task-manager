import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import startDB from "./src/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import taskRouter from "./src/routes/taskRoutes.js";
import path from "path";

const app = express();

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use(morgan("dev"));

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const startServer = async () => {
  try {
    await startDB();
    app.listen(process.env.PORT, () => {
      console.log(`Running on PORT : ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome User");
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

startServer();
