#! /bin/bash

echo "Setting up the project"
echo "Creating data directory"

mkdir data 2> /dev/null

echo "Configuring git"
git config --local commit.template .github/commit_template
git config --local core.hookspath .github/hookspath

echo "Done"
