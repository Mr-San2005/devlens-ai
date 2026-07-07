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