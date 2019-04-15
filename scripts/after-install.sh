#!/usr/bin/env bash

source /home/ubuntu/.bashrc

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

cd /home/ubuntu/kobetransfer

npm run clean
npm run install
npm run build