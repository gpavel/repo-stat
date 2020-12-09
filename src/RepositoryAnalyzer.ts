import { unsupportedRepositoryUrl } from "./errors";
import { Logger, RepositoryParser, RepositoryStatistic } from "./models";

export class RepositoryAnalyzer {
  private parsers: RepositoryParser[] = [];

  constructor(public logger: Logger) {
  }

  registerParser(parser: RepositoryParser): void {
    this.parsers = this.parsers.concat(parser);
  }

  analyze(repositoryUrl: string): Promise<RepositoryStatistic> {
    const repositoryParser = this.parsers.find(parser => parser.canParse(repositoryUrl));

    if (!repositoryParser) {
      this.logger.warn("Parser has not been found for the URL " + repositoryUrl);
      return unsupportedRepositoryUrl(repositoryUrl);
    }

    this.logger.log("Parser is found", { repositoryParser });

    return repositoryParser.parse(repositoryUrl);
  }
}
