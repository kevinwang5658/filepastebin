#!/usr/bin/env bash

exec &>> /home/ubuntu/install-logs/log-astart.out

set -e

cd /home/ubuntu/kobetransfer

source /home/ubuntu/.bashrc

npm install -g pm2
pm2 start -f dist/server/server.js