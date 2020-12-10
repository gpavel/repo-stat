export interface CommitInfo {
  message: string;
}

export interface RepositoryInfo {
  user: string;
  project: string;
  stars: number;
  commitsPerWeekOverYear: number;
  recentCommits: CommitInfo[];
}

export interface RepositoryFetcher {
  canFetch(repositoryUrl: string): boolean;
  fetch(repositoryUrl: string): Promise<RepositoryInfo>;
}

export interface Logger {
  error(...args: any[]): void;
  log(...args: any[]): void;
  warn(...args: any[]): void;
}
