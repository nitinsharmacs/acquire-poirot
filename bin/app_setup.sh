#! /bin/bash

echo "Setting up the project"
echo -e "Creating data directory\n"
mkdir data 2> /dev/null
echo "\"{}\"" > ./data/users.json

echo -e "SESSION_KEY = \"hello\"
HOST_TEMPLATE_PATH = \"resources/host-page.html\"
LOGIN_TEMPLATE = \"resources/login.html\"
SIGNUP_TEMPLATE = \"resources/sign-up.html\"
USERS_DB_PATH = \"data/users.json\"" > .env

echo "Installing dependencies"
npm install
