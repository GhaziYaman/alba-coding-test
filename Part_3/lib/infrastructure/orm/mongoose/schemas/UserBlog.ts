import mongoose, { Schema } from "mongoose";
import User from "./User";
import Blog from "./Blog";

const schema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  },
  { timestamps: true }
);

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export default mongoose.model("r_UserBlog", schema);
