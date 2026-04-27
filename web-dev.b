#!/bin/sh
# Start local dev server at http://localhost:8788 (binds to 0.0.0.0 — also accessible via http://<your-ip>:8788).

POLYGONS=web/locations_polygons.json
if [ ! -f "$POLYGONS" ]; then
  echo "Downloading $POLYGONS from production..."
  curl -sf -o "$POLYGONS" https://oref-map.org/locations_polygons.json \
    && echo "Done." \
    || echo "WARNING: Download failed. The map will not display polygons."
fi

npx --yes wrangler pages dev web/ --ip 0.0.0.0 "$@"
