import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    color: {
      type: String,
      default: "#6366f1",
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project ||
  mongoose.model("Project", projectSchema);

export default Project;