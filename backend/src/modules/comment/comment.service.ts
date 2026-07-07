import { Comment } from "../../models/comment.model";

export const createComment = async (
  message: string,
  task: string,
  author: string
) => {

  return await Comment.create({
    message,
    task,
    author,
  });

};

export const getCommentsByTask = async (
  taskId: string
) => {

  return await Comment.find({
    task: taskId,
  })
    .populate("author", "name email")
    .sort({
      createdAt: 1,
    });

};