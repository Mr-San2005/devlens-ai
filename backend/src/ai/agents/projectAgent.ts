import { getProjectTasks } from "../tools/task.tool";
import { getGitHubContext } from "../tools/github.tool";
import { getProjectDetails } from "../tools/project.tool";
import { getRecentProjectComments } from "../tools/comment.tool";
import { buildDeveloperContext } from "../context/contextBuilder";
import {
  generateResponse,
  chatWithContext,
  generateHealthSummary,
  generateOnboardingGuide,
} from "../services/gemini.service";

const buildFullContext = async (
  projectId: string,
  owner: string,
  repo: string
) => {
  const [tasks, github, project, comments] = await Promise.all([
    getProjectTasks(projectId),
    getGitHubContext(owner, repo),
    getProjectDetails(projectId),
    getRecentProjectComments(projectId),
  ]);

  const completedTasks = tasks
    .filter((t: any) => t.status === "DONE")
    .map((t: any) => ({
      title: t.title,
      description: t.description || "",
    }));

  const pendingTasks = tasks
    .filter((t: any) => t.status !== "DONE")
    .map((t: any) => ({
      title: t.title,
      description: t.description || "",
      status: t.status,
      assignedTo: t.assignedTo?.name,
    }));

  const commits = github.commits.map(
    (c: any) => `${c.commit.author.name}: ${c.commit.message} (${c.commit.author.date})`
  );

  const recentComments = comments.map(
    (c: any) => `${c.author?.name} on "${(c.task as any)?.title}": ${c.message}`
  );

  return buildDeveloperContext({
    projectName: (project as any)?.name || repo,
    readme: github.readme,
    fileTree: github.fileTree,
    commits,
    completedTasks,
    pendingTasks,
    recentComments,
  });
};

export const generateDeveloperBrief = async (
  projectId: string,
  owner: string,
  repo: string
) => {
  const context = await buildFullContext(projectId, owner, repo);
  return generateResponse(context);
};

export const chatWithProject = async (
  projectId: string,
  owner: string,
  repo: string,
  question: string
) => {
  const context = await buildFullContext(projectId, owner, repo);
  return chatWithContext(context, question);
};

export const generateProjectHealth = async (
  projectId: string,
  owner: string,
  repo: string
) => {
  const [tasks, github] = await Promise.all([
    getProjectTasks(projectId),
    getGitHubContext(owner, repo),
  ]);

  const total = tasks.length;
  const done = tasks.filter((t: any) => t.status === "DONE").length;
  const inProgress = tasks.filter((t: any) => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter((t: any) => t.status === "TODO").length;
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

  const healthContext = {
    progressPercent,
    totalTasks: total,
    completedTasks: done,
    inProgressTasks: inProgress,
    pendingTasks: todo,
    openIssues: github.issues.length,
    openPullRequests: github.pullRequests.length,
    recentCommits: github.commits.slice(0, 5).map((c: any) => c.commit.message),
  };

  const summary = await generateHealthSummary(healthContext);
  return { ...healthContext, summary };
};

export const generateOnboarding = async (
  projectId: string,
  owner: string,
  repo: string
) => {
  const context = await buildFullContext(projectId, owner, repo);
  return generateOnboardingGuide(context);
};
