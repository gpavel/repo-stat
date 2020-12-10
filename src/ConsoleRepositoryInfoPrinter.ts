import TtyTable, { Header } from 'tty-table';

import { CommitInfo, RepositoryInfo, RepositoryInfoPrinter } from "./models";

export class ConsoleRepositoryInfoPrinter implements RepositoryInfoPrinter {
  printMainInfo(info: RepositoryInfo): string {
    const printable = {
      user: info.user,
      repo: info.project,
      stars: info.stars || '0',
      'Commits per week over year, avg.': info.commitsPerWeekOverYear,
    }
    return TtyTable(
      Object.keys(printable).map(headerName => ({ value: headerName }) as Header),
      [printable],
    ).render();
  }

  printCommitsInfo(commits: CommitInfo[]): string {
    const printableMessages = commits.map(
      ({ message }, index) => ({ message, index: index.toString(10) }),
    );

    return TtyTable(
      [
        { value: 'index' } as Header,
        {
          value: 'message',
          align: 'left'
        } as Header,
      ],
      printableMessages
    ).render();
  }

  print(repositoryUrl: string, info: RepositoryInfo): void {
    console.log(`Summary of ${repositoryUrl}:\n`);
    console.log(this.printMainInfo(info));
    console.log('\n\nMost recent commits:\n');
    console.log(this.printCommitsInfo(info.recentCommits));
    console.log(`\n=============== END ===============\n\n`);
  }
}
