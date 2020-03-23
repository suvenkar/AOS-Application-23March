#!/usr/bin/env bash

NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

cp -f ./accountservice/target/accountservice.war ./kubernetes/accountservice/
zip -r ./kubernetes/accountservice.zip ./kubernetes/accountservice/
curl -s -u $NEXUS_CREDENTIALS --upload-file ./kubernetes/accountservice.zip $NEXUS_ARTIFACT_URL