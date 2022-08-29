#! /bin/bash

echo "Setting up the project"
echo -e "SESSION_KEY = \"hello\"" > .env

echo "Installing dependencies"
npm install
