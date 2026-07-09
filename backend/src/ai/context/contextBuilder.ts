interface DeveloperContext {
  projectName: string;
  commits: string[];
  completedTasks: string[];
  pendingTasks: string[];
  recentComments: string[];
}

export const buildDeveloperContext = (
  context: DeveloperContext
) => {

  return {
    project: context.projectName,

    commits: context.commits,

    completedTasks: context.completedTasks,

    pendingTasks: context.pendingTasks,

    recentComments: context.recentComments,
  };

};