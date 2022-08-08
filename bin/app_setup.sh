#! /bin/bash

echo "Setting up the project"
echo -e "Creating data directory\n"
mkdir data 2> /dev/null

echo -e "COOKIE_NAME = \"sessionId\"
SESSION_KEY = \"hello\"
HOST_TEMPLATE_PATH = \"resources/host-page.html\"
LOGIN_TEMPLATE = \"resources/login.html\"
SIGNUP_TEMPLATE = \"resources/sign-up.html\"" > .env

echo "Installing dependencies"
npm install
