import { Project } from "../../models/project.model";

export const getProjectDetails = async (projectId: string) => {
  return await Project.findById(projectId).populate("createdBy", "name email");
};
