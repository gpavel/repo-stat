import { OctokitResponse } from '@octokit/types';

export function unsupportedRepositoryUrlError(url: string): never {
  throw new Error(`Repository URL is invalid or not supported: ${url}`);
}

export function notFoundError(repositoryUrl: string): never {
  throw new Error(`Repository has not been found ${repositoryUrl}`);
}

export function forbiddenError(repositoryUrl: string): never {
  throw new Error(`Cannot get access to the repository: ${repositoryUrl}`);
}

export function unknownError(context?: string): never {
  let messages = ['Something went wrong'];
  if (context) {
    messages = messages.concat(context);
  }
  throw new Error(messages.join(': '));
}

export class GithubRepositoryFetcherError extends Error {
  constructor(message: string, readonly statusCode: number, public readonly response: OctokitResponse<any, number>) {
    super(message);
  }
}
