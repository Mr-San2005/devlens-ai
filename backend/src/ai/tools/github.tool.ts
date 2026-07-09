import {
  getLatestCommits,
  getOpenIssues,
  getPullRequests,
  getReadme,
  getRepoFileTree,
  getRepository,
} from "../services/github.service";

export const getGitHubContext = async (owner: string, repo: string) => {
  const [repository, commits, issues, pullRequests, fileTree, readme] =
    await Promise.all([
      getRepository(owner, repo),
      getLatestCommits(owner, repo),
      getOpenIssues(owner, repo),
      getPullRequests(owner, repo),
      getRepoFileTree(owner, repo),
      getReadme(owner, repo),
    ]);

  return { repository, commits, issues, pullRequests, fileTree, readme };
};
