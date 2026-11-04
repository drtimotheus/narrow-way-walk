#!/usr/bin/env zsh
# ============================================================================
# THE NARROW WAY — Link Approved LvD Universe Art into Zone 1 (Read-Only Copy)
# Copies Timothy's existing approved Sea of Glass Issue 1 art
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
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-05.png" "$ART_OUT/sea-01-panel-05.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-06.png" "$ART_OUT/sea-01-panel-06.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-08.png" "$ART_OUT/sea-01-panel-08.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-11.png" "$ART_OUT/sea-01-panel-11.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-14.png" "$ART_OUT/sea-01-panel-14.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-28.png" "$ART_OUT/sea-01-panel-28.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-30.png" "$ART_OUT/sea-01-panel-30.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-31.png" "$ART_OUT/sea-01-panel-31.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-35.png" "$ART_OUT/sea-01-panel-35.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-38.png" "$ART_OUT/sea-01-panel-38.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-39.png" "$ART_OUT/sea-01-panel-39.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-41.png" "$ART_OUT/sea-01-panel-41.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-42.png" "$ART_OUT/sea-01-panel-42.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-43.png" "$ART_OUT/sea-01-panel-43.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-45.png" "$ART_OUT/sea-01-panel-45.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-47.png" "$ART_OUT/sea-01-panel-47.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-49.png" "$ART_OUT/sea-01-panel-49.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-52.png" "$ART_OUT/sea-01-panel-52.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-53.png" "$ART_OUT/sea-01-panel-53.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-62.png" "$ART_OUT/sea-01-panel-62.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-64.png" "$ART_OUT/sea-01-panel-64.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-65.png" "$ART_OUT/sea-01-panel-65.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-66.png" "$ART_OUT/sea-01-panel-66.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-67.png" "$ART_OUT/sea-01-panel-67.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-69.png" "$ART_OUT/sea-01-panel-69.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-74.png" "$ART_OUT/sea-01-panel-74.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-76.png" "$ART_OUT/sea-01-panel-76.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-81.png" "$ART_OUT/sea-01-panel-81.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-85.png" "$ART_OUT/sea-01-panel-85.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-86.png" "$ART_OUT/sea-01-panel-86.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-89.png" "$ART_OUT/sea-01-panel-89.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-92.png" "$ART_OUT/sea-01-panel-92.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-94.png" "$ART_OUT/sea-01-panel-94.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-95.png" "$ART_OUT/sea-01-panel-95.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-96.png" "$ART_OUT/sea-01-panel-96.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-98.png" "$ART_OUT/sea-01-panel-98.png"
cp -f "$LVD_DIR/art/sea-01/sea-01-panel-100.png" "$ART_OUT/sea-01-panel-100.png"

echo "Copied approved Sea of Glass Issue 1 art into $ART_OUT (read-only copy; source untouched)."
