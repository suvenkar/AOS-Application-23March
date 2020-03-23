#!/usr/bin/env bash
NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

cp -f ./mastercredit/target/MasterCredit.war ./kubernetes/mastercredit/
zip -r ./kubernetes/mastercredit.zip ./kubernetes/mastercredit/
curl -s -u $NEXUS_CREDENTIALS --upload-file ./kubernetes/mastercredit.zip $NEXUS_ARTIFACT_URL