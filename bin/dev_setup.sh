#! /bin/bash

echo "Setting up the project"
echo "Creating data directory"

mkdir data 2> /dev/null

echo "Adding git template config"
git config --local commit.template .github/commit_template

echo "Done"
