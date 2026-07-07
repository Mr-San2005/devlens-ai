import { Task } from "../../models/task.model";

export const getProjectTasks = async (
  projectId: string
) => {

  const tasks = await Task.find({
    project: projectId,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  return tasks;

};