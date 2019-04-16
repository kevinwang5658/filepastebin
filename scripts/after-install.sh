#!/usr/bin/env bash

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>/home/ubuntu/log-ainstall.out 2>&1

set -e

cd /home/ubuntu/kobetransfer
chown -R ubuntu:ubuntu /home/ubuntu/kobetransfer
