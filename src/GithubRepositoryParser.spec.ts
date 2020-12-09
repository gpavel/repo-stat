import { GithubRepositoryParser } from "./GithubRepositoryParser";

describe('GithubRepositoryParser', () => {
  let parser: GithubRepositoryParser;

  beforeEach(() => {
    parser = new GithubRepositoryParser();
  });

  it('should accept github repository URL', () => {
    expect(parser.canParse('https://github.com/gpavel/repo-stat')).toBeTrue();
  });

  it('must not accept non-github repository URL', () => {
    expect(parser.canParse('https://gitlab.com/gitlab-org/gitlab-foss')).toBeFalse();
  });
});
