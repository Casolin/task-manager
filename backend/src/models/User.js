import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    pfp: {
      type: String,
      default: function () {
        return `https://classyprofile.com/api/avatar?email=${this.email}&size=80&v=5`;
      },
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
