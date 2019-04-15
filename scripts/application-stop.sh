#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

#pm2 delete server