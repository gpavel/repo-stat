import { Octokit } from '@octokit/core';
import { OctokitResponse } from '@octokit/types';

import { HttpStatusCode } from './HttpStatusCode';
import { forbiddenError, GithubRepositoryFetcherError, notFoundError, unknownError, unsupportedRepositoryUrlError } from './errors';

import { RepositoryFetcher, RepositoryInfo } from "./models";

function nonDefaultResponseError(status: number, response: OctokitResponse<any, number>): never {
  throw new GithubRepositoryFetcherError('Non-default response', status, response);
}

export class GithubRepositoryFetcher implements RepositoryFetcher {
  static readonly urlPattern = /^(https?:\/\/)?github.com\/([A-Za-z]+[^\/]*)\/([A-Za-z]+[^\/]*)/;

  static extractOwnerAndRepo(repositoryUrl: string): Pick<RepositoryInfo, 'project' | 'user'> {
    const matchResult = repositoryUrl.match(GithubRepositoryFetcher.urlPattern) as string[];
    const [,, user, project] = matchResult;

    return { user, project };
  }

  constructor(private octokit: Octokit) {}

  checkResponseErrors<T>(url: string, response: OctokitResponse<T, HttpStatusCode>): void {
    switch(response.status) {
      case HttpStatusCode.NotFound:
        notFoundError(url);
      case HttpStatusCode.Forbidden:
        forbiddenError(url);
    }
  }

  canFetch(repositoryUrl: string): boolean {
    return GithubRepositoryFetcher.urlPattern.test(repositoryUrl);
  }

  async getStarsCount(owner: string, repo: string): Promise<Pick<RepositoryInfo, 'stars'>> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}', { owner, repo });

    if (response.status !== HttpStatusCode.OK) {
      nonDefaultResponseError(response.status, response);
    }

    return { stars: response.data.stargazers_count };
  }

  async getYearlyStatistic(owner: string, repo: string): Promise<Pick<RepositoryInfo, 'commitsPerWeekOverYear'>> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
      owner,
      repo,
    });

    if (response.status !== HttpStatusCode.OK) {
      nonDefaultResponseError(response.status, response);
    }

    const commitsPerWeekOverYear = response.data.reduce((acc, stat) => acc + stat.total, 0) / response.data.length;

    return { commitsPerWeekOverYear };
  }

  async getRecentMasterCommits(owner: string, repo: string): Promise<Pick<RepositoryInfo, 'recentCommits'>> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/commits', {
      direction: 'desc',
      owner,
      repo,
    });

    if (response.status !== HttpStatusCode.OK) {
      nonDefaultResponseError(response.status, response);
    }

    return {
      recentCommits: response.data.slice(0,3).map(commit => ({ message: commit.commit.message })),
    };
  }

  async fetch(repositoryUrl: string): Promise<RepositoryInfo> {
    if (!this.canFetch(repositoryUrl)) {
      unsupportedRepositoryUrlError(repositoryUrl);
    }

    const basicInfo = GithubRepositoryFetcher.extractOwnerAndRepo(repositoryUrl);
    try {
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
    } catch (error: GithubRepositoryFetcherError | unknown) {
      console.error(error);
      if (error instanceof GithubRepositoryFetcherError) {
        switch(error.statusCode) {
          case HttpStatusCode.MovedPermanently:
            return this.fetch(error.response.headers.location as string);
          case HttpStatusCode.NotFound:
            notFoundError(repositoryUrl);
          case HttpStatusCode.Forbidden:
            forbiddenError(repositoryUrl);
          default:
            unknownError(repositoryUrl);
        }
      }
      throw error;
    }
  }
}
