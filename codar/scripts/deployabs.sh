#!/bin/bash

tomcathome=$4
echo $tomcathome
cd /tmp
sudo yum install -q -y  unzip
if [ $? = 0 ]; then
    echo "Yes"
else
    echo "No"
    sudo apt-get install -y  unzip
fi
sudo cp /tmp/aos.zip $tomcathome/webapps
cd $tomcathome/webapps
sudo unzip -o aos.zip
sudo rm -rf $tomcathome/webapps/aos.zip
#rm -rf /tmp/aos.zip
sudo service tomcat restart

