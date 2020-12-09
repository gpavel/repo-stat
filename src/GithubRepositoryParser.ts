import { RepositoryParser, RepositoryStatistic } from "./models";

export class GithubRepositoryParser implements RepositoryParser {
  static readonly urlPattern = /^(https?:\/\/)?github.com\/[A-Za-z]+[^\/]*\/[A-Za-z]+/

  canParse(repositoryUrl: string): boolean {
    return GithubRepositoryParser.urlPattern.test(repositoryUrl);
  }

  parse(repositoryUrl: string): Promise<RepositoryStatistic> {
    throw new Error("Method not implemented.");
  }
}
