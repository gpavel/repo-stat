import { Octokit } from '@octokit/core';

import { RepositoryFetcher, RepositoryInfo } from "./models";

export class GithubRepositoryFetcher implements RepositoryFetcher {
  static readonly urlPattern = /^(https?:\/\/)?github.com\/([A-Za-z]+[^\/]*)\/([A-Za-z]+[^\/]*)/;

  static extractOwnerAndRepo(repositoryUrl: string): Pick<RepositoryInfo, 'project' | 'user'> {
    const matchResult = repositoryUrl.match(GithubRepositoryFetcher.urlPattern) as string[];
    const [,, user, project] = matchResult;

    return { user, project };
  }

  constructor(private octokit: Octokit) {}

  canFetch(repositoryUrl: string): boolean {
    return GithubRepositoryFetcher.urlPattern.test(repositoryUrl);
  }

  async fetch(repositoryUrl: string): Promise<RepositoryInfo> {
    const basicInfo = GithubRepositoryFetcher.extractOwnerAndRepo(repositoryUrl);

    const fullRepoResponse = await this.octokit.request(`GET /repos/{owner}/{repo}`, {
      owner: basicInfo.user,
      repo: basicInfo.project,
    });

    return {
      user: basicInfo.user,
      project: basicInfo.project,
      stars: fullRepoResponse.data.stargazers_count,
    } as any;
  }
}
