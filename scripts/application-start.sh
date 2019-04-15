#!/usr/bin/env bash

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>~/log-astart.out 2>&1

source /home/ubuntu/.bashrc

pm2 start -f dist/server/server.js