import { Request, Response } from "express";
import { Project } from "../../models/project.model";
import {
  generateDeveloperBrief,
  chatWithProject,
  generateProjectHealth,
  generateOnboarding,
} from "../../ai/agents/projectAgent";

const getProjectWithGitHub = async (projectId: string, res: Response) => {
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return null;
  }
  if (!project.github?.owner || !project.github?.repo) {
    res.status(400).json({ message: "GitHub repository not configured" });
    return null;
  }
  return project as typeof project & { github: { owner: string; repo: string } };
};

export const developerBrief = async (req: Request, res: Response) => {
  try {
    const project = await getProjectWithGitHub(req.body.projectId, res);
    if (!project) return;
    const brief = await generateDeveloperBrief(
      req.body.projectId,
      project.github.owner,
      project.github.repo
    );
    res.json({ brief });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "AI service error" });
  }
};

export const projectChat = async (req: Request, res: Response) => {
  try {
    const { projectId, question } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }
    const project = await getProjectWithGitHub(projectId as string, res);
    if (!project) return;
    const answer = await chatWithProject(
      projectId as string,
      project.github.owner,
      project.github.repo,
      question as string
    );
    res.json({ answer });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "AI service error" });
  }
};

export const projectHealth = async (req: Request, res: Response) => {
  try {
    const project = await getProjectWithGitHub(req.params.projectId as string, res);
    if (!project) return;
    const health = await generateProjectHealth(
      req.params.projectId as string,
      project.github.owner,
      project.github.repo
    );
    res.json(health);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "AI service error" });
  }
};

export const onboarding = async (req: Request, res: Response) => {
  try {
    const project = await getProjectWithGitHub(req.params.projectId as string, res);
    if (!project) return;
    const guide = await generateOnboarding(
      req.params.projectId as string,
      project.github.owner,
      project.github.repo
    );
    res.json({ guide });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "AI service error" });
  }
};
