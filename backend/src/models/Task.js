import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    assignedUsers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Pending", "In-Progress", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    dueDate: { type: Date },
  },

  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.createdAt = ret.createdAt.toISOString().split("T")[0];
        ret.updatedAt = ret.updatedAt.toISOString().split("T")[0];
        if (ret.dueDate) {
          ret.dueDate = ret.dueDate.toISOString().split("T")[0];
        }
        return ret;
      },
    },
  }
);

TaskSchema.pre("save", async function () {
  if (!this.assignedUsers || this.assignedUsers.length === 0) {
    this.assignedUsers = [this.createdBy];
  }
});

export default mongoose.model("Task", TaskSchema);
