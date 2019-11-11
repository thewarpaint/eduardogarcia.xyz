# Course: Version Control Systems (git)

## Prerequisites

- Basic shell usage
- [GitHub account with SSH keys setup](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)
- [Recent git installed (>2.0)](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## What is a VCS?

## Why is it useful?

- Collaboration: many people working on the same project
- Accountability and auditing: who did what, when and why?
- Being able to undo stuff (features, release rollbacks)
- Pinpointing regressions

## git

- Distributed
- Concepts: remote, commits (graph), diff, branch, ...
- Actions: checkout, commit, rebase, cherry pick, blame, stash, bisect, reflog, stash, ...
- Conflict resolution

### Concepts

**Remote**

> Remote repositories are versions of your project that are hosted on the Internet or network somewhere.

[Source](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

```sh
git clone git@github.com:thewarpaint/git-course.git
```

Different protocols: SSH and SSH keys, HTTPS and username/password.

https://help.github.com/en/github/using-git/which-remote-url-should-i-use

```sh
git remote -v
```

In some workflows every collaborator shares the same remote repository. In others you have your own
personal fork which you commit to and an upstream remote you submit Pull Requests to.

```sh
git remote add personal git@github.com:personal/git-course.git
```

**Commits**

> A commit, or "revision", is an individual change to a file (or set of files). [...] Commits usually contain a commit message which is a brief description of what changes were made.

[Source](https://help.github.com/en/github/getting-started-with-github/github-glossary#commit)

Commits are snapshots of the repository at a given point in time.

**Branches**

Create a feature branch:

```sh
git checkout -b feature/add-eduardo-garcia-name
```

Add your name to the list of participants:

```html
<!-- index.html -->
<ul>
  <li>Eduardo García</li>
</ul>
```

**Diff**

> A diff is the difference in changes between two commits, or saved changes. The diff will visually describe what was added or removed from a file since its last commit.

[Source](https://help.github.com/en/github/getting-started-with-github/github-glossary#diff)

```sh
git diff
```

Then add your file to the staging area:

```sh
git add index.html
git status
```

... and commit your change:

```sh
git commit -m "Add Eduardo García to participants list"
```

**Commit messages**

+ Start with verb in present tense
+ Clear and concise description of the change
+ Add as much detail as needed in the following lines

Current state of the repository:

```
A master
 \
  B feature/add-eduardo-garcia-name
```

```sh
git push origin feature/add-eduardo-garcia
```

Then go to [thewarpaint/git-course](https://github.com/thewarpaint/git-course) to create a Pull Request, and merge it.

```sh
git checkout master
git pull
```

**Rebase**

```sh
git checkout feature/add-FIRST-LAST
git rebase master
```

Resolve conflicts, then push to the remote again:

```sh
git push --force
```

**Merge vs rebase**

## Branching models

### Continuous Development (`master`, `feature/*`)

```sh
A-----------E master
 \         /
  B---C---D feature/add-eduardo-garcia
```

### GitFlow (`master`, `release/*`, `develop`, `feature/*`, `hotfix/*`)

```sh
A-------------------G master
 \                 /
  \               F release/2019-12-31
   \             /
    \           E develop
     \         /
      B---C---D feature/add-eduardo-garcia
```

## Code review
