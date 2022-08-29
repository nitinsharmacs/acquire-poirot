#! /bin/bash

GREEN="\x1b[32m"
RED="\x1b[31m"
RESET="\x1b[0m"

echo "Configuring git"
git config --local commit.template .github/commit_template
git config --local core.hookspath .github/hooks
echo -e "Configured git\n"

echo "Installing vscode extensions"
declare -a extensions

extensions=(
  patbenatar.advanced-new-file
  dbaeumer.vscode-eslint
  bierner.markdown-checkbox
  2gua.rainbow-brackets
  vscode-icons-team.vscode-icons
)

for extension in ${extensions[@]}
do
  code --install-extension ${extension} &> /dev/null
  if [[ $? != 0 ]]; then
    echo -e "${RED}Error : Can't install ${extension}${RESET}"
  else
    echo -e "${GREEN}-> Installed ${extension}${RESET}"
  fi
done

echo "Installing redis"
brew install redis
brew services start redis

echo -e "\nDone"
