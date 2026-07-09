import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getRepository = async (
  owner: string,
  repo: string
) => {

  const { data } = await octokit.repos.get({
    owner,
    repo,
  });

  return data;

};

export const getLatestCommits = async (
  owner: string,
  repo: string
) => {

  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 10,
  });

  return data;

};

export const getOpenIssues = async (
  owner: string,
  repo: string
) => {

  const { data } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: "open",
    per_page: 10,
  });

  return data;

};

export const getPullRequests = async (
  owner: string,
  repo: string
) => {

  const { data } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
    per_page: 10,
  });

  return data;

};

export const getRepoFileTree = async (
  owner: string,
  repo: string
): Promise<string[]> => {
  try {
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: repoData.default_branch,
      recursive: "true",
    });
    return data.tree
      .filter((item) => item.type === "blob" && item.path)
      .map((item) => item.path as string)
      .filter((p) => !p.includes("node_modules") && !p.includes(".lock") && !p.includes("dist/"))
      .slice(0, 80);
  } catch {
    return [];
  }
};

export const getReadme = async (
  owner: string,
  repo: string
): Promise<string> => {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: "README.md",
    });
    if ("content" in data && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8").slice(0, 3000);
    }
    return "";
  } catch {
    return "";
  }
};