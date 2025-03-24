#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define the temporary directory
TEMP_DIR=$(mktemp -d)

# Checkout the main branch and copy the src directory to the temporary location
git checkout main
cp -r src/* "$TEMP_DIR"

# Checkout the gh-pages branch
git checkout gh-pages

# Copy the contents of the src directory from the temporary location to the root directory
cp -r "$TEMP_DIR"/* .

# Add, commit, and push the changes
git add .
git commit -m "Deploy src to gh-pages"
git push origin gh-pages

# Clean up the temporary directory
rm -rf "$TEMP_DIR"

# Checkout back to the main branch
git checkout main
