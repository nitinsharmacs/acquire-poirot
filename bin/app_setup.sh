#! /bin/bash

echo "Setting up the project"
echo -e "Creating data directory\n"
mkdir data 2> /dev/null
echo {} > ./data/users.json
echo [] > ./data/game.json
echo [] > ./data/gameEntries.json

echo -e "SESSION_KEY = \"hello\"

echo "Installing dependencies"
npm install
