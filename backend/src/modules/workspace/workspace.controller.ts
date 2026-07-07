import { Request, Response } from "express";
import * as workspaceService from "./workspace.service";

export const createWorkspace = async (
  req: Request,
  res: Response
) => {

  const workspace =
    await workspaceService.createWorkspace(
      req.body.name,
      req.body.description,
      (req as any).user.id
    );

  res.status(201).json(workspace);

};

export const getMyWorkspaces = async (
  req: Request,
  res: Response
) => {

  const workspaces =
    await workspaceService.getMyWorkspaces(
      (req as any).user.id
    );

  res.json(workspaces);

};

export const getWorkspaceMembers = async (
  req: Request,
  res: Response
) => {

  const members =
    await workspaceService.getWorkspaceMembers(
      req.params.workspaceId as string
    );

  res.json(members);

};