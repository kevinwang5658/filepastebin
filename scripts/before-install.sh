#!/usr/bin/env bash

exec &>> /home/ubuntu/install-logs/log-binstall.out

set -e

rm -rf /home/ubuntu/kobetransfer/{,.[!.],..?}*