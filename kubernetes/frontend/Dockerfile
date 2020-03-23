FROM tool-registry:30006/tomcat-8:jdk8
MAINTAINER chuang.he@hpe.com
RUN rm -rf /usr/local/tomcat/webapps/ROOT
ADD ROOT.war /usr/local/tomcat/webapps/
ADD catalog.war /usr/local/tomcat/webapps/
ADD order.war /usr/local/tomcat/webapps/
