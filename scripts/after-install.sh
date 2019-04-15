#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

cd /home/ubuntu/kobetransfer

find . -type d -exec chmod 755 {} \;

su -c "./install.sh" ubuntu