#!/usr/bin/env zsh
# ============================================================================
# THE NARROW WAY — Link Approved LvD Universe Art into Zone 1 (Read-Only Copy)
# FLAG: DEC-07 — Copies Timothy's existing approved Sea of Glass Issue 1 art
# and Mentor/Guest portraits from "/Users/Timotheus/Desktop/LvD Universe" into
# assets/art/ without modifying or touching the source folder.
# ============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LVD_DIR="/Users/Timotheus/Desktop/LvD Universe"
ART_OUT="$ROOT_DIR/assets/art"

mkdir -p "$ART_OUT"

cp -f "$LVD_DIR/cover-redo-sea-01/sea-01-cover-art.png" "$ART_OUT/sea-01-cover-art.png"
cp -f "$LVD_DIR/cover-redo-sea-01/sea-01-cover-preview.jpg" "$ART_OUT/sea-01-cover-preview.jpg"
cp -f "$LVD_DIR/art/issue-01/portraits/david.png" "$ART_OUT/david.png"
cp -f "$LVD_DIR/art/issue-01/portraits/daniel.png" "$ART_OUT/daniel.png"
cp -f "$LVD_DIR/art/issue-01/portraits/paul.png" "$ART_OUT/paul.png"
cp -f "$LVD_DIR/art/issue-01/portraits/esther.png" "$ART_OUT/esther.png"
cp -f "$LVD_DIR/art/sea-01/portraits/elias.png" "$ART_OUT/elias.png"
cp -f "$LVD_DIR/art/sea-02/portraits/adaeze.png" "$ART_OUT/adaeze.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-04.png" "$ART_OUT/sea-01-panel-04.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-06.png" "$ART_OUT/sea-01-panel-06.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-11.png" "$ART_OUT/sea-01-panel-11.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-14.png" "$ART_OUT/sea-01-panel-14.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-35.png" "$ART_OUT/sea-01-panel-35.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-74.png" "$ART_OUT/sea-01-panel-74.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-92.png" "$ART_OUT/sea-01-panel-92.png"

echo "Copied approved Sea of Glass Issue 1 art into $ART_OUT (read-only copy; source untouched)."
