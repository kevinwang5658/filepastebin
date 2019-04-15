#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

cd /home/ubuntu/kobetransfer

chown -R ubuntu:ubuntu .

#su -c "./install.sh" ubuntu