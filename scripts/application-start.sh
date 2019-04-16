#!/usr/bin/env bash

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>/home/ubuntu/log-astart.out 2>&1

cd /home/ubuntu/kobetransfer

source /home/ubuntu/.bashrc

npm install -g pm2
pm2 start -f dist/server/server.js