import { Task } from "../../models/task.model";

export const createTask = async (
  title: string,
  description: string,
  projectId: string,
  createdBy: string
) => {
  return await Task.create({
    title,
    description,
    project: projectId,
    createdBy,
  });
};

export const getProjectTasks = async (
  projectId: string
) => {
  return await Task.find({
    project: projectId,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");
};
export const updateTaskStatus = async (
  taskId: string,
  status: string
) => {

  return await Task.findByIdAndUpdate(
    taskId,
    {
      status,
    },
    {
      new: true,
    }
  );

};

export const assignTask = async (
  taskId: string,
  userId: string
) => {

  return await Task.findByIdAndUpdate(
    taskId,
    {
      assignedTo: userId,
    },
    {
      returnDocument: "after",
    }
  ).populate(
    "assignedTo",
    "name email"
  );

};