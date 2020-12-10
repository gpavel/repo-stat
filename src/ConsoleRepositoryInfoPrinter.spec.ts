import { ConsoleRepositoryInfoPrinter } from "./ConsoleRepositoryInfoPrinter";

fdescribe('ConsoleRepositoryInfoPrinter', () => {
  let printer: ConsoleRepositoryInfoPrinter;

  beforeEach(() => {
    printer = new ConsoleRepositoryInfoPrinter();
  })

  it('should print information nicelly', () => {
    printer.print('github.com/angular/angular', {
      user: 'angular',
      project: 'angular',
      stars: 533,
      commitsPerWeekOverYear: 53.22315247233,
      recentCommits: [
        { message: 'Revert "ci: update pullapprove config to add comp labels" (#40053)\n\nThis reverts commit 9f8ccd577f481a3ca4508287ec06cdf863561f69. The\nPullApprove labeling is unfortunately removing labels rather than\nadding them.\n\nPR Close #40053' },
        { message: 'release: cut the v11.1.0-next.2 release' },
        { message: 'test(compiler-cli): fix and re-enable compliance source-map tests (#40040)\n\nThese tests started failing because they had type-check\nerrors in their templates, and a recent commit turned on\nfull template type-checking by default.\\n\nThis commit fixes those templates and updates the expected\nfiles as necessary.\n\nPR Close #40040' },
      ]
    })
  });
})
