#!/usr/bin/env bash
#the script is to build&tag docker image and push it to registry
#url of the zip file on Nexus
FILE_URL=$1
#docker image name
IMG_NAME=$2
#docker image version to be tag and push
IMG_VERSION=$3
if [x$IMG_VERSION == x];then
    echo "Please provide image versjion for tag and push"
fi

#download the zip file for each service --- in progress, will add check for sleep
wget FILE_URL
sleep 4
unzip -o $IMG_NAME.zip
sleep 3
docker build ./$IMG_NAME/ -t dev-registry:4999/$IMG_NAME:$IMG_VERSION
sleep 10
docker push dev-registry:4999/$IMG_NAME:$IMG_VERSION
sleep 5

#docker build ./accountservice/ -t dev-registry:4999/accountservice:$IMG_VERSION
#docker build ./order/ -t dev-registry:4999/order:$IMG_VERSION
#docker build ./catalog/ -t dev-registry:4999/catalog:onepod
#docker build ./shipex/ -t dev-registry:4999/shipex:$IMG_VERSION
#docker build ./safepay/ -t dev-registry:4999/safepay:$IMG_VERSION
#docker build ./mastercredit/ -t dev-registry:4999/mastercredit:$IMG_VERSION
#docker build ./frontend/ -t dev-registry:4999/frontend:$IMG_VERSION
#docker push dev-registry:4999/order:$IMG_VERSION
#docker push dev-registry:4999/accountservice:$IMG_VERSION
#docker push dev-registry:4999/catalog:onepod
#docker push dev-registry:4999/mastercredit:$IMG_VERSION
#docker push dev-registry:4999/safepay:$IMG_VERSION
#docker push dev-registry:4999/shipex:$IMG_VERSION
#docker push dev-registry:4999/frontend:$IMG_VERSION
