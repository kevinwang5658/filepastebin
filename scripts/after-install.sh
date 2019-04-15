#!/usr/bin/env bash

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>~/log-ainstall.out 2>&1

cd /home/ubuntu/kobetransfer

chown -R ubuntu:ubuntu .

#su -c "./install.sh" ubuntu