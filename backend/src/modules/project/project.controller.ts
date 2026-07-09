import { Request, Response } from "express";
import * as projectService from "./project.service";

export const createProject = async (req: Request, res: Response) => {
  const project = await projectService.createProject(
    req.body.name,
    req.body.description,
    req.body.workspaceId,
    (req as any).user.id
  );
  res.status(201).json(project);
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await projectService.getProjects(
    req.params.workspaceId as string
  );
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(
    req.params.projectId as string
  );
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await projectService.updateProject(
    req.params.projectId as string,
    req.body
  );
  res.json(project);
};
