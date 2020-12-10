import { Octokit } from "@octokit/core";
import { ConsoleRepositoryInfoPrinter } from "./ConsoleRepositoryInfoPrinter";
import { GithubRepositoryFetcher } from "./GithubRepositoryFetcher";
import { RepositoryAnalyzer } from "./RepositoryAnalyzer";
import { SimpleLogger } from "./SimpleLogger";

export async function main(args: string[]): Promise<void> {
  const repositoryAnalyzer = new RepositoryAnalyzer(
    new SimpleLogger(),
    new ConsoleRepositoryInfoPrinter(),
  );

  const githubRepositoryFetcher = new GithubRepositoryFetcher(new Octokit());

  repositoryAnalyzer.registerFetcher(githubRepositoryFetcher);

  for (let repositoryUrl of args) {
    await repositoryAnalyzer.analyze(repositoryUrl);
  }
}

main(process.argv.slice(2));
