import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id username role email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const adminUser = req.user;
    console.log(adminUser);
    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admin only" });
    }

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.role === "admin") {
      return res.status(403).json({
        message: "You cannot delete an admin user",
      });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete user" });
  }
};
