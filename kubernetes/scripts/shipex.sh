#!/usr/bin/env bash

NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

cp -f ./shipex/target/ShipEx.war ./kubernetes/shipex/
zip -r ./kubernetes/shipex.zip ./kubernetes/shipex/
curl -s -u $NEXUS_CREDENTIALS --upload-file ./kubernetes/shipex.zip $NEXUS_ARTIFACT_URL
