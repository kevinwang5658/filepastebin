#!/usr/bin/env bash

exec &> /var/log/aws/codedeploy-agent/codedeploy-agent.log

rm -rf /home/ubuntu/kobetransfer/{,.[!.],..?}*