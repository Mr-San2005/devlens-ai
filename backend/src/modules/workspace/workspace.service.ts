import { Workspace } from "../../models/workspace.model";

export const createWorkspace = async (
  name: string,
  description: string,
  ownerId: string
) => {
  return await Workspace.create({
    name,
    description,
    owner: ownerId,
    members: [ownerId],
  });
};

export const getMyWorkspaces = async (
  userId: string
) => {
  return await Workspace.find({
    members: userId,
  }).populate("owner", "name email");
};