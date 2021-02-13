#!/bin/bash
export docker=/usr/bin/docker

docker context use default
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/t9u2b2i6
docker build -t filepastebin .
docker tag filepastebin:latest public.ecr.aws/t9u2b2i6/filepastebin:latest
docker push public.ecr.aws/t9u2b2i6/filepastebin:latest

docker context use myecscontext
docker compose up
