export function unsupportedRepositoryUrl(url: string): Promise<never> {
  return Promise.reject(new Error(`Repository URL is invalid or not supported: ${url}`));
}
