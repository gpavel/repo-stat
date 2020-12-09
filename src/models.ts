export interface RepositoryCommitInfo {
  title: string;
  date: string;
}

export interface RepositoryStatistic {
  user: string;
  project: string;
  stars: number;
  commitsPerWeekOverYear: number;
  recentCommits: RepositoryCommitInfo[];
}

export interface RepositoryFetcher {
  canFetch(repositoryUrl: string): boolean;
  fetch(repositoryUrl: string): Promise<RepositoryStatistic>;
}

export interface Logger {
  error(...args: any[]): void;
  log(...args: any[]): void;
  warn(...args: any[]): void;
}
