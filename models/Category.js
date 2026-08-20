import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      default: "#6366f1",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

export default Category;