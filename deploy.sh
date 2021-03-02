#!/bin/bash
docker login
docker build -t filepastebin .
docker tag filepastebin:latest kevinwang5658/filepastebin
docker push kevinwang5658/filepastebin

aws lightsail create-container-service-deployment --cli-input-yaml file://lightsail-deployment.yaml

