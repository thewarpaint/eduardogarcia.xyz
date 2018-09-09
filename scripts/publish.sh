#!/usr/bin/env bash

# Should be called from the project's root directory
./scripts/build.sh
git checkout -B gh-pages
git add . && git commit -m "Release `git log --pretty=format:'%h' -n 1` (`date '+%Y-%m-%d %H:%M'`) [ci skip]"
git push -f origin gh-pages
