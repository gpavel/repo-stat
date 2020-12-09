import { GithubRepositoryFetcher } from "./GithubRepositoryFetcher";
import { RepositoryAnalyzer } from "./RepositoryAnalyzer";
import { SimpleLogger } from "./SimpleLogger";

export async function main(args: string[]): Promise<void> {
  const repositoryAnalyzer = new RepositoryAnalyzer(new SimpleLogger());
  repositoryAnalyzer.registerFetcher(new GithubRepositoryFetcher());

  for (let repositoryUrl of args) {
    console.log('Analizing', { repositoryUrl });
    const statistic = await repositoryAnalyzer.analyze(repositoryUrl);
    console.log({ statistic });
  }
}

main(process.argv.slice(2));
