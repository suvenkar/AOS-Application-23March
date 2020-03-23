#!/usr/bin/env bash
NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

cp -f ./catalog/target/catalog.war ./kubernetes/frontend/
cp -f ./root/target/ROOT.war ./kubernetes/frontend/
zip -r ./kubernetes/frontend.zip ./kubernetes/frontend/
curl -s -u $NEXUS_CREDENTIALS --upload-file ./kubernetes/frontend.zip $NEXUS_ARTIFACT_URL