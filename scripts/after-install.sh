#!/usr/bin/env bash

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>/home/ubuntu/log-ainstall.out 2>&1

cd /home/ubuntu/kobetransfer
chown -R ubuntu:ubuntu .

#switch to user Ubuntu
sudo -u ubuntu bash <<EOF
    #need to load the bashrc for non-interactive shells
    source /home/ubuntu/.bashrc

    #load nvm to path
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

    npm run clean
    npm install
    npm run build
EOF