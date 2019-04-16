#!/usr/bin/env bash

exec &>> /home/ubuntu/install-logs/log-ainstall.out

set -e

cd /home/ubuntu/kobetransfer
chown -R ubuntu:ubuntu /home/ubuntu/kobetransfer
