import { Octokit } from '@octokit/core';
import { unsupportedRepositoryUrlError } from './errors';

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

  async getStarsCount(owner: string, repo: string): Promise<Pick<RepositoryInfo, 'stars'>> {
    const fullRepoResponse = await this.octokit.request('GET /repos/{owner}/{repo}', { owner, repo });
    return {
      stars: fullRepoResponse.data.stargazers_count,
    };
  }

  async getYearlyStatistic(owner: string, repo: string): Promise<Pick<RepositoryInfo, 'commitsPerWeekOverYear'>> {
    const yearlyStat = await this.octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
      owner,
      repo,
    });

    const commitsPerWeekOverYear = yearlyStat.data.reduce((acc, stat) => acc + stat.total, 0) / yearlyStat.data.length;

    return { commitsPerWeekOverYear };
  }

  async getRecentMasterCommits(owner: string, repo: string): Promise<Pick<RepositoryInfo, 'recentCommits'>> {

    const commits = await this.octokit.request('GET /repos/{owner}/{repo}/commits', {
      direction: 'desc',
      owner,
      repo,
    });

    return {
      recentCommits: commits.data.slice(0,3).map(commit => ({ message: commit.commit.message })),
    };
  }

  async fetch(repositoryUrl: string): Promise<RepositoryInfo> {
    if (!this.canFetch(repositoryUrl)) {
      unsupportedRepositoryUrlError(repositoryUrl);
    }

    const basicInfo = GithubRepositoryFetcher.extractOwnerAndRepo(repositoryUrl);

    const partials = await Promise.all([
      await this.getStarsCount(basicInfo.user, basicInfo.project),
      await this.getYearlyStatistic(basicInfo.user, basicInfo.project),
      await this.getRecentMasterCommits(basicInfo.user, basicInfo.project),
    ]);

    return {
      ...partials[0],
      ...partials[1],
      ...partials[2],
      user: basicInfo.user,
      project: basicInfo.project,
    };
  }
}
