# Course: Version Control Systems (git)

## Prerequisites

- Basic shell usage
- [GitHub account with SSH keys setup](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)
- [Recent git installed (>2.0)](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## What is a Version Control System (VCS)?

> Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later.

[source](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)

## Why is it useful?

- Collaboration: many people working on the same project
- Accountability and auditing: who did what, when and why?
    - `git blame`
- Being able to undo stuff (features, release rollbacks)
    - `git revert`
- Pinpointing regressions
    - `git bisect`

## git

- Distributed
- Concepts: remote, commits (graph), diff, branch, ...
- Actions: checkout, commit, rebase, cherry pick, blame, stash, bisect, reflog, stash, ...
- Conflict resolution

### Remotes

> Remote repositories are versions of your project that are hosted on the Internet or network somewhere.

[Source](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

```sh
$ git clone git@github.com:thewarpaint/git-course.git

Cloning into 'git-course'...
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 10 (delta 1), reused 8 (delta 0), pack-reused 0
Receiving objects: 100% (10/10), done.
Resolving deltas: 100% (1/1), done.

$ cd git-course
```

Different protocols: SSH and SSH keys, HTTPS and username/password.

https://help.github.com/en/github/using-git/which-remote-url-should-i-use

```sh
$ git remote -v

origin	git@github.com:thewarpaint/git-course.git (fetch)
origin	git@github.com:thewarpaint/git-course.git (push)
```

In some workflows every collaborator shares the same remote repository. In others you have your own
personal fork which you commit to and an upstream remote you submit Pull Requests to.

```sh
git remote add personal git@github.com:personal/git-course.git
```

### Commits

> A commit, or "revision", is an individual change to a file (or set of files). [...] Commits usually contain a commit message which is a brief description of what changes were made.

[Source](https://help.github.com/en/github/getting-started-with-github/github-glossary#commit)

Commits are snapshots of the repository at a given point in time.

### Branches (checkout)

Create a feature branch:

```sh
$ git checkout -b feature/add-eduardo-garcia

Switched to a new branch 'feature/add-eduardo-garcia'
```

Add your name to the list of participants:

```html
<!-- index.html -->
<h1>Participants</h1>

<ul>
  <li>Eduardo García</li>
</ul>
```

### Diff

> A diff is the difference in changes between two commits, or saved changes. The diff will visually describe what was added or removed from a file since its last commit.

[Source](https://help.github.com/en/github/getting-started-with-github/github-glossary#diff)

```sh
git diff
```

```diff
diff --git a/index.html b/index.html
index 8153e8e..aad3f6f 100644
--- a/index.html
+++ b/index.html
@@ -1,4 +1,5 @@
 <h1>Participants</h1>

 <ul>
+  <li>Eduardo García</li>
 </ul>
```

```sh
$ git status

On branch feature/add-eduardo-garcia
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   index.html

no changes added to commit (use "git add" and/or "git commit -a")
```

Then add your file to the staging area:

```sh
$ git add index.html
$ git status

On branch feature/add-eduardo-garcia
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html
```

... and commit your change:

```sh
$ git commit -m "Add Eduardo García to participants list"

[feature/add-eduardo-garcia dce1bc1] Add Eduardo García to participants list
 1 file changed, 1 insertion(+)
```

### Commit messages

+ Start with verb in present tense
+ Clear and concise description of the change
+ Add as much detail as needed in the following lines

Current state of the repository:

```
A master
 \
  B feature/add-eduardo-garcia
```

### Log

```sh
$ git log

commit dce1bc117b8781299e1f6aade9564657d5a0061f (HEAD -> feature/add-eduardo-garcia)
Author: Eduardo Garcia <eduardogarcia.xyz+gh@gmail.com>
Date:   Mon Nov 11 23:10:22 2019 -0600

    Add Eduardo García to participants list

commit 76230e795fb3fd71bed884d2a022a3fa0b1407e5 (origin/master, origin/HEAD, master)
Author: Eduardo Garcia <eduardogarcia.xyz+gh@gmail.com>
Date:   Mon Nov 11 22:57:15 2019 -0600

    Add empty participants list
```

### Push

```sh
$ git push origin feature/add-eduardo-garcia

Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 4 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 333 bytes | 333.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
remote:
remote: Create a pull request for 'feature/add-eduardo-garcia' on GitHub by visiting:
remote:      https://github.com/thewarpaint/git-course/pull/new/feature/add-eduardo-garcia
remote:
To github.com:thewarpaint/git-course.git
 * [new branch]      feature/add-eduardo-garcia -> feature/add-eduardo-garcia
```

Then go to [thewarpaint/git-course](https://github.com/thewarpaint/git-course) to create a Pull Request, and merge it.

(If you're trying this on your own, create a new branch from master before pulling, add another name to the list,
commit your changes and create a second PR)


### Pull

```sh
$ git checkout master

Switched to branch 'master'
Your branch is up to date with 'origin/master'.

$ git pull

remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (1/1), done.
From github.com:thewarpaint/git-course
   76230e7..83bcc65  master     -> origin/master
Updating 76230e7..83bcc65
Fast-forward
 index.html | 1 +
 1 file changed, 1 insertion(+)
```

### Conflicts

```diff
$ git merge feature/add-childish-gambino --no-ff --no-commit

diff --cc index.html
index aad3f6f,6ecdb4a..0000000
--- a/index.html
+++ b/index.html
@@@ -1,5 -1,5 +1,9 @@@
  <h1>Participants</h1>

  <ul>
++<<<<<<< HEAD
 +  <li>Eduardo García</li>
++=======
+   <li>Childish Gambino</li>
++>>>>>>> feature/add-childish-gambino
  </ul>
  
$ git merge --abort
```

### Rebase

```sh
$ git checkout feature/add-childish-gambino
$ git rebase master
```

Resolve conflicts, then push to the remote again:

```sh
git push --force
```

### Merge vs rebase

TBD

### Blame

```sh
$ git blame index.html
^76230e7 (Eduardo Garcia 2019-11-11 22:57:15 -0600 1) <h1>Participants</h1>
^76230e7 (Eduardo Garcia 2019-11-11 22:57:15 -0600 2)
^76230e7 (Eduardo Garcia 2019-11-11 22:57:15 -0600 3) <ul>
dce1bc11 (Eduardo Garcia 2019-11-11 23:10:22 -0600 4)   <li>Eduardo García</li>
^76230e7 (Eduardo Garcia 2019-11-11 22:57:15 -0600 5) </ul>
```

## Branching models

### Continuous Development (`master`, `feature/*`)

```sh
A-----------E master
 \         /
  B---C---D feature/add-eduardo-garcia
```

- `master` is the stable branch
- `feature/*` branches
    - created from master
    - updated often whenever master changes
    - contain a set of related changes that achieve a given objective: introduce a new feature,
      fix a bug (`bugfix/*`), add or improve documentation (`docs/*`), etc.
- `feature/*` branches are **tested in isolation**
    - deployed to a test environment
- when a `feature/*` branch accomplishes its purpose and doesn't break other features it is
  merged and deployed to the production environment

#### References

- [Continuous delivery workflows with the branch-per-issue model](https://www.atlassian.com/continuous-delivery/principles/workflows-with-feature-branching-and-gitflow)

### GitFlow (`master`, `develop`, `feature/*`, `release/*`, `hotfix/*`)

```sh
A-------------------G master
 \                 /
  \               F release/2019-12-31
   \             /
    \           E develop
     \         /
      B---C---D feature/add-eduardo-garcia
```

#### References

- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## Code review

## GUIs

## Advanced topics

- Submodules
