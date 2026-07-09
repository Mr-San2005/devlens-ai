import {
  getLatestCommits,
  getOpenIssues,
  getPullRequests,
  getRepository,
} from "../services/github.service";

export const getGitHubContext = async (
  owner: string,
  repo: string
) => {

  const repository =
    await getRepository(owner, repo);

  const commits =
    await getLatestCommits(owner, repo);

  const issues =
    await getOpenIssues(owner, repo);

  const pullRequests =
    await getPullRequests(owner, repo);

  return {

    repository,

    commits,

    issues,

    pullRequests,

  };

};