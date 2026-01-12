import Task from "../models/Task.js";

export const taskList = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .populate("createdBy", "pfp username email")
      .populate("assignedUsers", "pfp username email");

    if (!tasks) return res.status(404).json("No tasks found");

    tasks.forEach((task) => {
      if (
        task.createdBy?.pfp &&
        !task.createdBy.pfp.startsWith("http") &&
        !task.createdBy.pfp.startsWith("data:")
      ) {
        task.createdBy.pfp = `${req.protocol}://${req.get("host")}${
          task.createdBy.pfp
        }`;
      }

      task.assignedUsers.forEach((user) => {
        if (
          user.pfp &&
          !user.pfp.startsWith("http") &&
          !user.pfp.startsWith("data:")
        ) {
          user.pfp = `${req.protocol}://${req.get("host")}${user.pfp}`;
        }
      });
    });

    return res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const usersTaskList = async (req, res) => {
  try {
    const usersTasks = await Task.find()
      .populate("createdBy", "pfp username email")
      .populate("assignedUsers", "pfp username email");

    if (!usersTasks) return res.status(404).json("No tasks found");

    usersTasks.forEach((task) => {
      if (
        task.createdBy?.pfp &&
        !task.createdBy.pfp.startsWith("http") &&
        !task.createdBy.pfp.startsWith("data:")
      ) {
        task.createdBy.pfp = `${req.protocol}://${req.get("host")}${
          task.createdBy.pfp
        }`;
      }

      task.assignedUsers.forEach((user) => {
        if (
          user.pfp &&
          !user.pfp.startsWith("http") &&
          !user.pfp.startsWith("data:")
        ) {
          user.pfp = `${req.protocol}://${req.get("host")}${user.pfp}`;
        }
      });
    });

    return res.status(200).json(usersTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      dueDate,
      assignedUsers,
      order,
      priority,
      status,
    } = req.body;
    if (!title)
      return res
        .status(500)
        .json({ message: "You need to enter the title of the task" });
    const newTask = new Task({
      title,
      description,
      tags,
      createdBy: req.user.id,
      dueDate,
      assignedUsers,
      order,
      priority,
      status,
    });
    await newTask.save();

    res.status(201).json({ message: "Task added" }, newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editTask = async (req, res) => {
  try {
    console.log(req.user);
    const id = req.params.id;
    const { title, description, status, priority, tags, dueDate } = req.body;
    const updatedTask = { title, description, status, priority, tags, dueDate };

    let task;

    if (req.user.role === "admin") {
      task = await Task.findByIdAndUpdate(id, updatedTask, {
        new: true,
        runValidators: true,
      });
    } else {
      task = await Task.findOneAndUpdate(
        { _id: id, createdBy: req.user.id },
        updatedTask,
        { new: true, runValidators: true }
      );
    }

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    let task;

    if (req.user.role === "admin") {
      task = await Task.findOneAndDelete({
        _id: id,
      });
    } else {
      task = await Task.findOneAndDelete({
        _id: id,
        createdBy: req.user.id,
      });
    }

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  const userId = req.user.id;
  const total = await Task.countDocuments({ createdBy: userId });
  const completed = await Task.countDocuments({
    createdBy: userId,
    status: "Completed",
  });
  const pending = await Task.countDocuments({
    createdBy: userId,
    status: "Pending",
  });
  const inProgress = await Task.countDocuments({
    createdBy: userId,
    status: "In-Progress",
  });
  const lowTaskPriority = await Task.countDocuments({
    createdBy: userId,
    priority: "Low",
  });
  const mediumTaskPriority = await Task.countDocuments({
    createdBy: userId,
    priority: "Medium",
  });
  const highTaskPriority = await Task.countDocuments({
    createdBy: userId,
    priority: "High",
  });

  res.json({
    total,
    completed,
    pending,
    inProgress,
    lowTaskPriority,
    mediumTaskPriority,
    highTaskPriority,
  });
};
