#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

source /home/ubuntu/.bashrc

pm2 start -f dist/server/server.js