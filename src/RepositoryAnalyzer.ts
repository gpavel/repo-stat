import { unsupportedRepositoryUrl } from "./errors";
import { Logger, RepositoryFetcher, RepositoryInfo } from "./models";

export class RepositoryAnalyzer {
  private fetchers: RepositoryFetcher[] = [];

  constructor(public logger: Logger) {
  }

  registerFetcher(fetcher: RepositoryFetcher): void {
    this.fetchers = this.fetchers.concat(fetcher);
  }

  analyze(repositoryUrl: string): Promise<RepositoryInfo> {
    const repositoryFetcher = this.fetchers.find(fetcher => fetcher.canFetch(repositoryUrl));

    if (!repositoryFetcher) {
      this.logger.warn("Fetcher has not been found for the URL " + repositoryUrl);
      return unsupportedRepositoryUrl(repositoryUrl);
    }

    this.logger.log("Fetcher is found", { repositoryFetcher });

    return repositoryFetcher.fetch(repositoryUrl);
  }
}
