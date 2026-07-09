interface DeveloperContext {
  projectName: string;
  readme: string;
  fileTree: string[];
  commits: string[];
  completedTasks: { title: string; description: string }[];
  pendingTasks: { title: string; description: string; status: string; assignedTo?: string }[];
  recentComments: string[];
}

export const buildDeveloperContext = (context: DeveloperContext) => {
  return {
    project: context.projectName,
    readme: context.readme || "No README available",
    fileStructure: context.fileTree,
    recentCommits: context.commits,
    completedTasks: context.completedTasks,
    pendingTasks: context.pendingTasks,
    recentComments: context.recentComments,
  };
};
