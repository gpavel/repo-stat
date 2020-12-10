# RepoStat

This is CLI-like tool for obtaining short info about a public repository on GitHub:

- stars;
- average amount of commits per week over during last year;
- three most recent commit messages;

## Getting started

1. Clone the repository:

    ```sh
    git clone https://github.com/gpavel/repo-stat && cd ./repo-stat
    ```

1. Install NPM dependencies:

    ```sh
    npm install
    ```

1. Build the project:

    ```sh
    npm run build
    ```

## Run

Use `npm start` to launch the tool and pass the repositories as arguments separated by a whitespace.

```sh
npm start https://github.com/gpavel/repo-stat https://github.com/tecfu/tty-table
```
