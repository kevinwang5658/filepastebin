#!/usr/bin/env bash

exec &>> /home/ubuntu/install-logs/log-astop.out

set -e

source /home/ubuntu/.bashrc

npm install -g pm2
pm2 delete all