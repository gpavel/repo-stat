import { unsupportedRepositoryUrlError } from "./errors";
import { Logger, RepositoryFetcher, RepositoryInfoPrinter } from "./models";

export class RepositoryAnalyzer {
  private fetchers: RepositoryFetcher[] = [];

  constructor(public logger: Logger, public printer: RepositoryInfoPrinter) {
  }

  registerFetcher(fetcher: RepositoryFetcher): void {
    this.fetchers = this.fetchers.concat(fetcher);
  }

  async analyze(repositoryUrl: string): Promise<void> {
    const repositoryFetcher = this.fetchers.find(fetcher => fetcher.canFetch(repositoryUrl));

    if (!repositoryFetcher) {
      this.logger.warn("Fetcher has not been found for the URL " + repositoryUrl);
      unsupportedRepositoryUrlError(repositoryUrl);
    }

    const info = await repositoryFetcher.fetch(repositoryUrl);
    this.printer.print(repositoryUrl, info);
  }
}
