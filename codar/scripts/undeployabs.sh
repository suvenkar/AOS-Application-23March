#!/bin/bash

sudo service tomcat stop
sudo rm -rf /var/lib/tomcat7/webapps/*.*
sudo rm -rf /var/lib/tomcat7/webapps/*
sudo service tomcat start

