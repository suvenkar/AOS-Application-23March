cd ..
cd ..

COPY "accountservice\target\accountservice.war" "C:\apache-tomcat-8.5.13\webapps\accountservice.war" /Y
COPY "catalog\target\catalog.war" "C:\apache-tomcat-8.5.13\webapps\catalog.war" /Y
COPY "mastercredit\target\MasterCredit.war" "C:\apache-tomcat-8.5.13/webapps/MasterCredit.war" /Y
COPY "root\target\ROOT.war" "C:\apache-tomcat-8.5.13/webapps/ROOT.war" /Y
COPY "order\target\order.war" "C:\apache-tomcat-8.5.13/webapps/order.war" /Y
COPY "shipex\target\ShipEx.war" "C:\apache-tomcat-8.5.13/webapps/ShipEx.war" /Y
COPY "safepay\target\SafePay.war" "C:\apache-tomcat-8.5.13/webapps/SafePay.war" /Y

cd C:\apache-tomcat-8.5.13\bin
startup

