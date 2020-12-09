export interface RepositoryCommitInfo {
  title: string;
  date: string;
}

export interface RepositoryStatistic {
  url: string;
  stars: number;
  commitsPerWeekOverYear: number;
  recentCommits: RepositoryCommitInfo[];
}

export interface RepositoryParser {
  canParse(repositoryUrl: string): boolean;
  parse(repositoryUrl: string): Promise<RepositoryStatistic>;
}

export interface Logger {
  error(...args: any[]): void;
  log(...args: any[]): void;
  warn(...args: any[]): void;
}
