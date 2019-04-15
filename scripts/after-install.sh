#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

source /home/ubuntu/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

cd /home/ubuntu/kobetransfer

find . -type d -exec chmod 755 {} \;

npm run clean
npm install
npm run build