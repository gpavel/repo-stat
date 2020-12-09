import { RepositoryFetcher, RepositoryStatistic } from "./models";

export class GithubRepositoryFetcher implements RepositoryFetcher {
  static readonly urlPattern = /^(https?:\/\/)?github.com\/[A-Za-z]+[^\/]*\/[A-Za-z]+/

  canFetch(repositoryUrl: string): boolean {
    return GithubRepositoryFetcher.urlPattern.test(repositoryUrl);
  }

  fetch(repositoryUrl: string): Promise<RepositoryStatistic> {
    throw new Error("Method not implemented.");
  }
}
