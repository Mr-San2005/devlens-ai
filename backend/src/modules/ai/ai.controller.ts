import { Request, Response } from "express";
import { Project } from "../../models/project.model";
import { generateDeveloperBrief } from "../../ai/agents/projectAgent";

export const developerBrief = async (
  req: Request,
  res: Response
) => {

  const { projectId } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  if (
    !project.github ||
    !project.github.owner ||
    !project.github.repo
  ) {
    return res.status(400).json({
      message: "GitHub repository not configured",
    });
  }

  const brief = await generateDeveloperBrief(
    projectId,
    project.github.owner,
    project.github.repo
  );

  res.json({
    brief,
  });

};