#!/bin/bash

set -e

mkdir dist
cp -r src/* dist

git checkout gh-pages
git pull

cp -r dist/* .

git add .
git commit -m "Deploy src to gh-pages"
git push origin gh-pages

rm -rf dist
git checkout main
