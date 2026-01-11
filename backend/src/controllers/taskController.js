import Task from "../models/Task.js";

export const taskList = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).populate(
      "assignedUsers",
      "pfp username email"
    );
    if (!tasks) return res.status(404).json("No tasks found");

    tasks.forEach((task) => {
      task.assignedUsers.forEach((user) => {
        if (user.pfp && !user.pfp.startsWith("http")) {
          user.pfp = `${req.protocol}://${req.get("host")}${user.pfp}`;
        }
      });
    });

    return res.status(200).json(tasks);
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
    const id = req.params.id;
    const { title, description, assignedTo, status, priority, tags, order } =
      req.body;
    const updatedTask = {
      title,
      description,
      assignedTo,
      status,
      priority,
      tags,
      order,
    };
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      updatedTask,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOneAndDelete({
      _id: id,
      createdBy: req.user.id,
    });

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

  res.json({
    total,
    completed,
    pending,
    inProgress,
  });
};
