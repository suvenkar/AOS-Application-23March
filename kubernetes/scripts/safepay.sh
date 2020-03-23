#!/usr/bin/env bash

NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

cp -f ./safepay/target/SafePay.war ./kubernetes/safepay/
zip -r ./kubernetes/safepay.zip ./kubernetes/safepay/
curl -s -u $NEXUS_CREDENTIALS --upload-file ./kubernetes/safepay.zip $NEXUS_ARTIFACT_URL
