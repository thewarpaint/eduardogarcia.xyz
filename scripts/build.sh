#!/usr/bin/env bash

for filename in _posts/*.html; do
  LATEST_SHA="$(git log --pretty=format:'%H' -n 1 -- $filename)"
  LATEST_SHA_SHORT="$(git log --pretty=format:'%h' -n 1 -- $filename)"
  DATE_READABLE="$(git log --pretty=format:'%cd' --date=format:'%B %d, %Y' -n 1 -- $filename)"

  # TODO: Perhaps it can be done in fewer operations?
  sed -i -e "s/%LATEST_SHA%/$LATEST_SHA/g" $filename
  sed -i -e "s/%LATEST_SHA_SHORT%/$LATEST_SHA_SHORT/g" $filename
  sed -i -e "s/%DATE_READABLE%/$DATE_READABLE/g" $filename
done
