import { Project } from "../../models/project.model";

export const createProject = async (
  name: string,
  description: string,
  workspaceId: string,
  userId: string
) => {
  return await Project.create({
    name,
    description,
    workspace: workspaceId,
    createdBy: userId,
  });
};

export const getProjects = async (workspaceId: string) => {
  return await Project.find({ workspace: workspaceId }).populate(
    "createdBy",
    "name email"
  );
};

export const getProjectById = async (projectId: string) => {
  return await Project.findById(projectId).populate("createdBy", "name email");
};

export const updateProject = async (
  projectId: string,
  data: {
    name?: string;
    description?: string;
    github?: { owner: string; repo: string };
  }
) => {
  return await Project.findByIdAndUpdate(projectId, data, { new: true });
};
