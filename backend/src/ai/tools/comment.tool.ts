import { Comment } from "../../models/comment.model";
import { Task } from "../../models/task.model";

export const getRecentProjectComments = async (projectId: string) => {
  const tasks = await Task.find({ project: projectId }).select("_id");
  const taskIds = tasks.map((t) => t._id);

  return await Comment.find({ task: { $in: taskIds } })
    .populate("author", "name")
    .populate("task", "title")
    .sort({ createdAt: -1 })
    .limit(10);
};
