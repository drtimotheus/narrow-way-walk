#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "=================================================================="
echo "  THE NARROW WAY WALK — Push to GitHub (drtimotheus/narrow-way-walk)"
echo "=================================================================="
git status -s
git push -u origin main
echo ""
echo "Done! View repository at: https://github.com/drtimotheus/narrow-way-walk"
read -p "Press Enter to close..."
