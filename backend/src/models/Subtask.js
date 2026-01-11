import mongoose from "mongoose";

const SubtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Pending", "In-Progress", "Completed"],
      default: "Pending",
    },
    progress: { type: Number, default: 0 },
    task: { type: mongoose.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subtask", SubtaskSchema);
