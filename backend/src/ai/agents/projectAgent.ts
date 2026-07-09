import { getProjectTasks } from "../tools/task.tool";
import { getGitHubContext } from "../tools/github.tool";
import { buildDeveloperContext } from "../context/contextBuilder";
import { generateResponse } from "../services/gemini.service";

export const generateDeveloperBrief = async (
  projectId: string,
  owner: string,
  repo: string
) => {

  const tasks = await getProjectTasks(projectId);

  const github = await getGitHubContext(
    owner,
    repo
  );

  const completedTasks = tasks
    .filter((task: any) => task.status === "DONE")
    .map((task: any) => task.title);

  const pendingTasks = tasks
    .filter((task: any) => task.status !== "DONE")
    .map((task: any) => task.title);

  const commits = github.commits.map(
    (commit: any) => commit.commit.message
  );

  const context = buildDeveloperContext({

    projectName: repo,

    commits,

    completedTasks,

    pendingTasks,

    recentComments: [],

  });

  const response = await generateResponse(context);

  return response;

};