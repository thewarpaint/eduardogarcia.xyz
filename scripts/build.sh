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

# Custom Geometry Club fingerprinting
GEOMETRY_CLUB_HTML="_posts/2018-11-01-geometry-club.html"
GEOMETRY_CLUB_JS="assets/js/geometry-club.js"
GEOMETRY_CLUB_JS_SHA="$(git log --pretty=format:'%H' -n 1 -- $GEOMETRY_CLUB_JS)"
GEOMETRY_CLUB_CSS="assets/css/geometry-club.css"
GEOMETRY_CLUB_CSS_SHA="$(git log --pretty=format:'%H' -n 1 -- $GEOMETRY_CLUB_CSS)"

mv $GEOMETRY_CLUB_JS "$GEOMETRY_CLUB_JS.$GEOMETRY_CLUB_JS_SHA.js"
sed -i -e "s/geometry-club.js/geometry-club.js.$GEOMETRY_CLUB_JS_SHA.js/g" $GEOMETRY_CLUB_HTML

mv $GEOMETRY_CLUB_CSS "$GEOMETRY_CLUB_CSS.$GEOMETRY_CLUB_CSS_SHA.css"
sed -i -e "s/geometry-club.css/geometry-club.css.$GEOMETRY_CLUB_CSS_SHA.css/g" $GEOMETRY_CLUB_HTML
