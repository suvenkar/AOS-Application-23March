FROM tool-registry:30006/tomcat-8:secureData
MAINTAINER chuang.he@hpe.com
ENV LD_LIBRARY_PATH /opt/HPE-SecureData-Payments-Host-SDK-Linux-64bit-4.2.0-r218900/lib
RUN rm -rf /usr/local/tomcat/webapps/ROOT
ADD mastercredit.war /usr/local/tomcat/webapps/