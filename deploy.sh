#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -p|--profile)
      PROFILE="$2"
      shift
      shift
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

[ -z "$PROFILE" ] && PROFILE=default

docker login
if [[ $(uname -m) == 'arm64' ]]; then
  docker buildx build -t filepastebin --platform=linux/amd64 .
else
  docker build -t filepastebin .
fi
docker tag filepastebin:latest kevinwang5658/filepastebin
docker push kevinwang5658/filepastebin

AWS_PROFILE=$PROFILE aws lightsail create-container-service-deployment --cli-input-yaml file://lightsail-deployment.yaml

