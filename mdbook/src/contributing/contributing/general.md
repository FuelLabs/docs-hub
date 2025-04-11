
# General

You can find the repository for this website on [GitHub](https://github.com/FuelLabs/docs-hub/tree/master). For instructions on how to run the repository locally, see the [README](https://github.com/FuelLabs/docs-hub/blob/master/README.md).

## Contribution flow

This is a rough outline of what a contributor's workflow looks like:

- Create a feature branch off of the master branch, which is typically the base for your work.
- Make your changes, and commit your work.
- Run tests and make sure all tests pass.
- Push your changes to a branch in your fork of the repository and submit a pull request.
  - Use one of the following tags in the title of your PR:
    - `feat:` - A new feature
    - `fix:` - A bug fix
    - `docs:` - Documentation only changes
    - `style:` - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    - `refactor:` - A code change that neither fixes a bug nor adds a feature
    - `perf:` - A code change that improves performance
    - `test:` - Adding missing tests or correcting existing tests
    - `build:` - Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    - `ci:` - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    - `chore:` - Other changes that don't modify `src` or test files
    - `revert:` - Reverts a previous commit
- Complete the contributor agreement on the PR if it is not already completed.
- Your PR will be reviewed and some changes may be requested.
  - Once you've made the requested changes, your PR must be re-reviewed and approved.
  - If the PR becomes out of date, you can use GitHub's 'update branch' button.
  - If there are conflicts, you can merge and resolve them locally. Then push to your PR branch. Any changes to the branch will require a re-review.
- GitHub Actions will automatically test all authorized pull requests.
- Use GitHub to merge the PR once approved.

### Linking issues

If the pull request resolves the relevant issues, and you want GitHub to close these issues automatically after it merged into the default branch, you can use the syntax (`KEYWORD #ISSUE-NUMBER`) like this:

```md
close #123
```

If the pull request links an issue but does not close it, you can use the keyword `ref` like this:

```md
ref #456
```

Multiple issues should use full syntax for each issue and separate by a comma, like:

```md
close #123, ref #456
```

## Reporting Bugs

If you notice any bugs in the live website, please create a [new issue](https://github.com/FuelLabs/docs-hub/issues/new) on GitHub with:

- a description of the bug
- step-by-step instructions for how to reproduce the bug
