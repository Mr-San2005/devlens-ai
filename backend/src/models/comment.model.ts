import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model(
  "Comment",
  commentSchema
);