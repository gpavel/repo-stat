import { Octokit } from "@octokit/core";
import { GithubRepositoryFetcher } from "./GithubRepositoryFetcher";

describe('GithubRepositoryFetcher', () => {
  let fetcher: GithubRepositoryFetcher;
  let octokit: Octokit;

  beforeEach(() => {
    octokit = new Octokit()
    fetcher = new GithubRepositoryFetcher(octokit);
  });

  it('should accept github repository URL', () => {
    expect(fetcher.canFetch('https://github.com/gpavel/repo-stat')).toBeTrue();
  });

  it('must not accept non-github repository URL', () => {
    expect(fetcher.canFetch('https://gitlab.com/gitlab-org/gitlab-foss')).toBeFalse();
  });

  it('should fetch a github repository\'s statistic', async () => {
    const user = 'angular';
    const project = 'angular';
    const stat = await fetcher.fetch(`https://github.com/${user}/${project}`);

    expect(stat).toEqual(jasmine.objectContaining({ user, project }));

    expect(stat.stars).toBeGreaterThan(0);
    expect(stat.commitsPerWeekOverYear).toBeGreaterThanOrEqual(0);
    expect(stat.recentCommits.length).toBeLessThanOrEqual(3);
  });
});
