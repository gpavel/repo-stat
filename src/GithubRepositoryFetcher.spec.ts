import { GithubRepositoryFetcher } from "./GithubRepositoryFetcher";

describe('GithubRepositoryFetcher', () => {
  let fetcher: GithubRepositoryFetcher;

  beforeEach(() => {
    fetcher = new GithubRepositoryFetcher();
  });

  it('should accept github repository URL', () => {
    expect(fetcher.canFetch('https://github.com/gpavel/repo-stat')).toBeTrue();
  });

  it('must not accept non-github repository URL', () => {
    expect(fetcher.canFetch('https://gitlab.com/gitlab-org/gitlab-foss')).toBeFalse();
  });

  it('should fetch a github repository\'s statistic', async () => {
    const stat = await fetcher.fetch('https://github.com/gpavel/repo-stat');
    console.log(stat);
  });
});
