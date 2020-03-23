#!/usr/bin/env bash

NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

cp -f ./order/target/order.war ./kubernetes/order/
zip -r ./kubernetes/order.zip ./kubernetes/order/
curl -s -u $NEXUS_CREDENTIALS --upload-file ./kubernetes/order.zip $NEXUS_ARTIFACT_URL