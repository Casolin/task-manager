import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(401).json({ message: "All fields are required" });
    const user = await User.findOne({ username });
    if (user)
      return res.status(500).json({ message: "User already registred" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: "User registred successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let pfpUrl = user.pfp;

    if (user.pfp && user.pfp.startsWith("/uploads/")) {
      pfpUrl = `${req.protocol}://${req.get("host")}${user.pfp}`;
    }

    res.status(200).json({
      ...user.toObject(),
      pfp: pfpUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const pfpUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    user.pfp = `/uploads/${req.file.filename}`;
    await user.save();

    const fullUrl = `${req.protocol}://${req.get("host")}${user.pfp}`;
    res.status(200).json({ pfp: fullUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
