#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

cd /home/ubuntu/kobetransfer

npm run clean
npm run install
npm run build