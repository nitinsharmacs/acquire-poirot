#! /bin/bash

echo "Setting up the project"
echo -e "Creating data directory\n"
mkdir data 2> /dev/null

echo -e "COOKIE_NAME = \"sessionId\"
SESSION_KEY = \"hello\"
LOGIN_TEMPLATE = \"resources/login.html\"" > .env

echo "Installing dependencies"
npm install
