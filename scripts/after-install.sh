#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

source /home/ubuntu/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

cd /home/ubuntu/kobetransfer

/home/ubuntu/.nvm/versions/node/v11.12.0/bin/npm run clean
/home/ubuntu/.nvm/versions/node/v11.12.0/bin/npm install
/home/ubuntu/.nvm/versions/node/v11.12.0/bin/npm run build