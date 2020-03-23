#!/usr/bin/env bash


NEXUS_CREDENTIALS=$1
NEXUS_ARTIFACT_URL=$2

#examples for advantage shopping application
# copy war file from module target folder to kubernetes folder
cp -f ./accountservice/target/accountservice.war ./kubernetes/accountservice/
#cp -f ./order/target/order.war ./kubernetes/order/
cp -f ./catalog/target/catalog.war ./kubernetes/frontend/
cp -f ./mastercredit/target/MasterCredit.war ./kubernetes/mastercredit/
cp -f ./safepay/target/SafePay.war ./kubernetes/safepay/
cp -f ./shipex/target/ShipEx.war ./kubernetes/shipex/
cp -f ./root/target/ROOT.war ./kubernetes/frontend/
cp -f ./order/target/order.war ./kubernetes/frontend/

#zip folder for each service which contains Dockerfile and war files
tar -cczvf ./kubernetes/accountservice.tar.gz ./kubernetes/accountservice/
#tar -cczvf ./kubernetes/order.tar.gz ./kubernetes/order/
tar -cczvf ./kubernetes/mastercredit.tar.gz ./kubernetes/mastercredit/
tar -cczvf ./kubernetes/safepay.tar.gz ./kubernetes/safepay/
tar -cczvf ./kubernetes/shipex.tar.gz ./kubernetes/shipex/
tar -cczvf ./kubernetes/frontend.tar.gz ./kubernetes/frontend/


#upload zip file to nexus
#curl -s -u $NEXUS_CREDENTIALS --upload-file *.zip $NEXUS_ARTIFACT_URL"\accountservice.zip"