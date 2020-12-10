export function unsupportedRepositoryUrlError(url: string): never {
  throw new Error(`Repository URL is invalid or not supported: ${url}`);
}
